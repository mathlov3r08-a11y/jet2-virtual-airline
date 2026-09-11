import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } from "./auth-config.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
}

function redirect(url) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url
    }
  });
}

function randomId(length = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function sessionCookie(sessionId, maxAge) {
  return [
    `jet2_session=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAge}`
  ].join("; ");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * Discord OAuth: start login
     */
    if (url.pathname === "/api/auth/discord") {
      const state = randomId(32);

      const discordUrl = new URL(
        "https://discord.com/oauth2/authorize"
      );

      discordUrl.searchParams.set("client_id", DISCORD_CLIENT_ID);
      discordUrl.searchParams.set("response_type", "code");
      discordUrl.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
      discordUrl.searchParams.set("scope", "identify");
      discordUrl.searchParams.set("state", state);

      return new Response(null, {
        status: 302,
        headers: {
          Location: discordUrl.toString(),
          "Set-Cookie": [
            `jet2_oauth_state=${encodeURIComponent(state)}`,
            "Path=/",
            "HttpOnly",
            "Secure",
            "SameSite=Lax",
            "Max-Age=600"
          ].join("; ")
        }
      });
    }

    /*
     * Discord OAuth: callback
     */
    if (url.pathname === "/api/auth/discord/callback") {
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");
      const savedState = getCookie(request, "jet2_oauth_state");

      if (!code || !returnedState || !savedState) {
        return json(
          {
            error: "Invalid OAuth request."
          },
          400
        );
      }

      if (returnedState !== savedState) {
        return json(
          {
            error: "OAuth state verification failed."
          },
          400
        );
      }

      /*
       * Exchange the authorization code for a Discord access token.
       */
      const tokenResponse = await fetch(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: env.DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: DISCORD_REDIRECT_URI
          })
        }
      );

      if (!tokenResponse.ok) {
        return json(
          {
            error: "Discord token exchange failed."
          },
          502
        );
      }

      const tokenData = await tokenResponse.json();

      /*
       * Retrieve the authenticated Discord user.
       */
      const discordUserResponse = await fetch(
        "https://discord.com/api/users/@me",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`
          }
        }
      );

      if (!discordUserResponse.ok) {
        return json(
          {
            error: "Unable to retrieve Discord user."
          },
          502
        );
      }

      const discordUser = await discordUserResponse.json();

      /*
       * Create or update the local Jet2 user record.
       */
      await env.DB.prepare(
        `
        INSERT INTO users (
          discord_user_id,
          discord_username
        )
        VALUES (?, ?)
        ON CONFLICT(discord_user_id)
        DO UPDATE SET
          discord_username = excluded.discord_username,
          updated_at = CURRENT_TIMESTAMP
        `
      )
        .bind(
          discordUser.id,
          discordUser.username
        )
        .run();

      const userResult = await env.DB.prepare(
        `
        SELECT id
        FROM users
        WHERE discord_user_id = ?
        `
      )
        .bind(discordUser.id)
        .first();

      if (!userResult) {
        return json(
          {
            error: "Unable to create local user."
          },
          500
        );
      }

      /*
       * Create a server-side session.
       *
       * The Discord access token is NOT sent to the browser.
       */
      const sessionId = randomId(32);

      await env.DB.prepare(
        `
        INSERT INTO auth_sessions (
          id,
          user_id,
          expires_at
        )
        VALUES (?, ?, datetime('now', '+7 days'))
        `
      )
        .bind(sessionId, userResult.id)
        .run();

      /*
       * Clear the OAuth state cookie and establish the session.
       */
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/staff",
          "Set-Cookie": [
            sessionCookie(sessionId, 60 * 60 * 24 * 7),
            "jet2_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
          ]
        }
      });
    }

    /*
     * Temporary authentication status endpoint.
     */
    if (url.pathname === "/api/auth/me") {
      const sessionId = getCookie(request, "jet2_session");

      if (!sessionId) {
        return json({
          authenticated: false
        });
      }

      const session = await env.DB.prepare(
        `
        SELECT
          auth_sessions.id,
          auth_sessions.expires_at,
          users.discord_user_id,
          users.discord_username
        FROM auth_sessions
        JOIN users
          ON users.id = auth_sessions.user_id
        WHERE auth_sessions.id = ?
          AND datetime(auth_sessions.expires_at) > datetime('now')
        `
      )
        .bind(sessionId)
        .first();

      if (!session) {
        return json({
          authenticated: false
        });
      }

      return json({
        authenticated: true,
        user: {
          discordUserId: session.discord_user_id,
          username: session.discord_username
        }
      });
    }

    /*
     * All normal website requests are handled by Cloudflare Assets.
     */
    return env.ASSETS.fetch(request);
  }
};
