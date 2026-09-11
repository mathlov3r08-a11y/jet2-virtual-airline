import {
  DISCORD_CLIENT_ID,
  DISCORD_REDIRECT_URI
} from "./auth-config.js";

const JET2_GUILD_ID = "1394355545858773003";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

function redirect(url, cookies = []) {
  const headers = new Headers({
    Location: url
  });

  for (const cookie of cookies) {
    headers.append("Set-Cookie", cookie);
  }

  return new Response(null, {
    status: 302,
    headers
  });
}

function randomId() {
  return crypto.randomUUID();
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const trimmed = cookie.trim();
    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1);

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

function makeCookie(name, value, maxAge) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAge}`
  ].join("; ");
}

function clearCookie(name) {
  return [
    `${name}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0"
  ].join("; ");
}

async function discordRequest(path, options = {}) {
  return fetch(`https://discord.com/api/v10${path}`, options);
}

async function getDiscordUser(accessToken) {
  const response = await discordRequest("/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error("DISCORD_USER_LOOKUP_FAILED");
  }

  return response.json();
}

async function getJet2Member(discordUserId, botToken) {
  const response = await discordRequest(
    `/guilds/${JET2_GUILD_ID}/members/${discordUserId}`,
    {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("DISCORD_MEMBER_LOOKUP_FAILED");
  }

  return response.json();
}

async function getJet2Roles(botToken) {
  const response = await discordRequest(
    `/guilds/${JET2_GUILD_ID}/roles`,
    {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("DISCORD_ROLE_LOOKUP_FAILED");
  }

  return response.json();
}

function getHighestRole(member, roles) {
  if (!member?.roles?.length) {
    return null;
  }

  const roleMap = new Map(
    roles.map((role) => [role.id, role])
  );

  const memberRoles = member.roles
    .map((roleId) => roleMap.get(roleId))
    .filter(Boolean)
    .filter((role) => role.id !== JET2_GUILD_ID);

  if (memberRoles.length === 0) {
    return null;
  }

  memberRoles.sort((a, b) => b.position - a.position);

  return memberRoles[0];
}

async function createSession(db, userId) {
  const sessionId = randomId();

  await db.prepare(
    `
      INSERT INTO auth_sessions (
        id,
        user_id,
        expires_at
      )
      VALUES (
        ?,
        ?,
        datetime('now', '+7 days')
      )
    `
  )
    .bind(sessionId, userId)
    .run();

  return sessionId;
}

async function getSession(db, sessionId) {
  if (!sessionId) {
    return null;
  }

  return db.prepare(
    `
      SELECT
        auth_sessions.id,
        auth_sessions.user_id,
        auth_sessions.expires_at,
        users.discord_user_id,
        users.discord_username
      FROM auth_sessions
      INNER JOIN users
        ON users.id = auth_sessions.user_id
      WHERE auth_sessions.id = ?
        AND datetime(auth_sessions.expires_at) > datetime('now')
    `
  )
    .bind(sessionId)
    .first();
}

async function writeAuditLog(
  db,
  userId,
  action,
  targetType = null,
  targetId = null,
  details = null
) {
  await db.prepare(
    `
      INSERT INTO audit_logs (
        user_id,
        action,
        target_type,
        target_id,
        details
      )
      VALUES (?, ?, ?, ?, ?)
    `
  )
    .bind(
      userId,
      action,
      targetType,
      targetId,
      details ? JSON.stringify(details) : null
    )
    .run();
}

function startDiscordLogin() {
  const state = randomId();

  const discordUrl = new URL(
    "https://discord.com/oauth2/authorize"
  );

  discordUrl.searchParams.set(
    "client_id",
    DISCORD_CLIENT_ID
  );

  discordUrl.searchParams.set(
    "response_type",
    "code"
  );

  discordUrl.searchParams.set(
    "redirect_uri",
    DISCORD_REDIRECT_URI
  );

  discordUrl.searchParams.set(
    "scope",
    "identify guilds guilds.members.read"
  );

  discordUrl.searchParams.set(
    "state",
    state
  );

  return redirect(
    discordUrl.toString(),
    [
      makeCookie(
        "jet2_oauth_state",
        state,
        600
      )
    ]
  );
}

async function serveSpa(env, request) {
  const indexRequest = new Request(
    new URL("/index.html", request.url),
    request
  );

  return env.ASSETS.fetch(indexRequest);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * STAFF PORTAL AUTHENTICATION GATE
     */
    if (
      url.pathname === "/staff" ||
      url.pathname.startsWith("/staff/")
    ) {
      const sessionId = getCookie(
        request,
        "jet2_session"
      );

      const session = await getSession(
        env.DB,
        sessionId
      );

      if (!session) {
        return startDiscordLogin();
      }

      /*
       * A valid session exists.
       *
       * Serve the React SPA entry point rather
       * than looking for a physical /staff file.
       */
      return serveSpa(env, request);
    }

    /*
     * START DISCORD LOGIN
     */
    if (url.pathname === "/api/auth/discord") {
      return startDiscordLogin();
    }

    /*
     * DISCORD OAUTH CALLBACK
     */
    if (
      url.pathname ===
      "/api/auth/discord/callback"
    ) {
      const code = url.searchParams.get("code");
      const returnedState =
        url.searchParams.get("state");

      const savedState = getCookie(
        request,
        "jet2_oauth_state"
      );

      if (!code) {
        return json(
          {
            error:
              "Discord did not provide an authorization code."
          },
          400
        );
      }

      if (!returnedState || !savedState) {
        return json(
          {
            error:
              "Missing OAuth state."
          },
          400
        );
      }

      if (returnedState !== savedState) {
        return json(
          {
            error:
              "OAuth state verification failed."
          },
          400
        );
      }

      const tokenResponse = await fetch(
        "https://discord.com/api/v10/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id:
              DISCORD_CLIENT_ID,

            client_secret:
              env.DISCORD_CLIENT_SECRET,

            grant_type:
              "authorization_code",

            code,

            redirect_uri:
              DISCORD_REDIRECT_URI
          })
        }
      );

      if (!tokenResponse.ok) {
        return json(
          {
            error:
              "Discord authorization failed."
          },
          502
        );
      }

      const tokenData =
        await tokenResponse.json();

      if (!tokenData.access_token) {
        return json(
          {
            error:
              "Discord did not return an access token."
          },
          502
        );
      }

      let discordUser;

      try {
        discordUser =
          await getDiscordUser(
            tokenData.access_token
          );
      } catch {
        return json(
          {
            error:
              "Unable to retrieve your Discord account."
          },
          502
        );
      }

      let jet2Member;

      try {
        jet2Member =
          await getJet2Member(
            discordUser.id,
            env.DISCORD_BOT_TOKEN
          );
      } catch {
        return json(
          {
            error:
              "Unable to verify Jet2 | PTFS server membership."
          },
          502
        );
      }

      if (!jet2Member) {
        return new Response(
          "Access denied. Your Discord account is not a member of the Jet2 | PTFS server.",
          {
            status: 403,
            headers: {
              "content-type":
                "text/plain; charset=UTF-8"
            }
          }
        );
      }

      let jet2Roles;

      try {
        jet2Roles =
          await getJet2Roles(
            env.DISCORD_BOT_TOKEN
          );
      } catch {
        return json(
          {
            error:
              "Unable to retrieve Jet2 | PTFS roles."
          },
          502
        );
      }

      const highestRole =
        getHighestRole(
          jet2Member,
          jet2Roles
        );

      await env.DB.prepare(
        `
          INSERT INTO users (
            discord_user_id,
            discord_username
          )
          VALUES (?, ?)
          ON CONFLICT(discord_user_id)
          DO UPDATE SET
            discord_username =
              excluded.discord_username,
            updated_at =
              CURRENT_TIMESTAMP
        `
      )
        .bind(
          discordUser.id,
          discordUser.username
        )
        .run();

      const user = await env.DB.prepare(
        `
          SELECT id
          FROM users
          WHERE discord_user_id = ?
        `
      )
        .bind(discordUser.id)
        .first();

      if (!user) {
        return json(
          {
            error:
              "Unable to create your Jet2 account."
          },
          500
        );
      }

      const sessionId =
        await createSession(
          env.DB,
          user.id
        );

      await writeAuditLog(
        env.DB,
        user.id,
        "auth.login",
        "discord_user",
        discordUser.id,
        {
          username:
            discordUser.username,

          highest_role:
            highestRole?.name ?? null,

          role_ids:
            jet2Member.roles ?? []
        }
      );

      return redirect(
        "/staff",
        [
          makeCookie(
            "jet2_session",
            sessionId,
            60 * 60 * 24 * 7
          ),

          clearCookie(
            "jet2_oauth_state"
          )
        ]
      );
    }

    /*
     * CURRENT AUTHENTICATED USER
     */
    if (url.pathname === "/api/auth/me") {
      const sessionId =
        getCookie(
          request,
          "jet2_session"
        );

      const session =
        await getSession(
          env.DB,
          sessionId
        );

      if (!session) {
        return json({
          authenticated: false
        });
      }

      let jet2Member;

      try {
        jet2Member =
          await getJet2Member(
            session.discord_user_id,
            env.DISCORD_BOT_TOKEN
          );
      } catch {
        return json(
          {
            error:
              "Unable to verify current Discord membership."
          },
          502
        );
      }

      if (!jet2Member) {
        return json({
          authenticated: false,
          reason:
            "not_a_jet2_member"
        });
      }

      let jet2Roles;

      try {
        jet2Roles =
          await getJet2Roles(
            env.DISCORD_BOT_TOKEN
          );
      } catch {
        return json(
          {
            error:
              "Unable to retrieve current Jet2 roles."
          },
          502
        );
      }

      const highestRole =
        getHighestRole(
          jet2Member,
          jet2Roles
        );

      return json({
        authenticated: true,

        user: {
          discordUserId:
            session.discord_user_id,

          username:
            session.discord_username,

          rank:
            highestRole?.name ??
            "Staff Member",

          roleIds:
            jet2Member.roles ?? []
        }
      });
    }

    /*
     * LOG OUT
     */
    if (url.pathname === "/api/auth/logout") {
      const sessionId =
        getCookie(
          request,
          "jet2_session"
        );

      if (sessionId) {
        await env.DB.prepare(
          `
            DELETE FROM auth_sessions
            WHERE id = ?
          `
        )
          .bind(sessionId)
          .run();
      }

      return redirect(
        "/",
        [
          clearCookie(
            "jet2_session"
          )
        ]
      );
    }

    /*
     * PUBLIC WEBSITE
     */
    return env.ASSETS.fetch(request);
  }
};
