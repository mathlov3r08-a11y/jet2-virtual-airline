import {
  DISCORD_CLIENT_ID,
  DISCORD_REDIRECT_URI
} from "./auth-config.js";

const GUILD_ID = "1394355545858773003";

/* =========================================================
   ROLE DEFINITIONS
   ========================================================= */

const MAIN_RANKS = [
  {
    name: "Leadership",
    level: 6,
    portalAccess: true,
    roles: [
      ["ROLE_LEADERSHIP_CHM", "Chairman"],
      ["ROLE_LEADERSHIP_VCHM", "Vice Chairman"],
      ["ROLE_LEADERSHIP_CEO", "Chief Executive Officer"],
      ["ROLE_LEADERSHIP_COO", "Chief Operating Officer"]
    ]
  },
  {
    name: "Board of Directors",
    level: 5,
    portalAccess: true,
    roles: [
      ["ROLE_BOD_CDO", "Chief Development Officer"],
      ["ROLE_BOD_CTO", "Chief Technology Officer"],
      ["ROLE_BOD_CHRO", "Chief Human Resources Officer"],
      ["ROLE_BOD_CAO", "Chief Administrative Officer"],
      ["ROLE_BOD_CMO", "Chief Marketing Officer"],
      ["ROLE_BOD_COM", "Chief Operations Manager"],
      ["ROLE_BOD_CXO", "Chief Experience Officer"]
    ]
  },
  {
    name: "General Manager",
    level: 4,
    portalAccess: true,
    roles: [
      ["ROLE_GENERAL_MANAGER", "General Manager"]
    ]
  },
  {
    name: "Coordinator",
    level: 3,
    portalAccess: true,
    roles: [
      ["ROLE_COORDINATOR", "Coordinator"]
    ]
  },
  {
    name: "Associate",
    level: 2,
    portalAccess: true,
    roles: [
      ["ROLE_ASSOCIATE", "Associate"]
    ]
  },
  {
    name: "Management Intern",
    level: 1,
    portalAccess: true,
    roles: [
      ["ROLE_MANAGEMENT_INTERN", "Management Intern"]
    ]
  }
];

/*
 * Department positions.
 *
 * Each position has:
 * - Cloudflare variable containing the Discord role ID
 * - Display name
 * - Main Jet2 rank
 * - Department
 * - Internal rank level
 */

const DEPARTMENT_POSITIONS = [
  // Human Resources
  {
    env: "ROLE_HR_HRM",
    position: "Human Resources Manager",
    department: "Human Resources",
    rank: "General Manager",
    level: 4
  },
  {
    env: "ROLE_HR_SHRO",
    position: "Senior Human Resources Officer",
    department: "Human Resources",
    rank: "Coordinator",
    level: 3
  },
  {
    env: "ROLE_HR_HRO",
    position: "Human Resources Officer",
    department: "Human Resources",
    rank: "Associate",
    level: 2
  },
  {
    env: "ROLE_HR_HRT",
    position: "Human Resources Trainee",
    department: "Human Resources",
    rank: "Management Intern",
    level: 1
  },

  // Public Relations & Marketing
  {
    env: "ROLE_PRM_PRM",
    position: "PR Manager",
    department: "Public Relations & Marketing",
    rank: "General Manager",
    level: 4
  },
  {
    env: "ROLE_PRM_SPRC",
    position: "Senior PR Coordinator",
    department: "Public Relations & Marketing",
    rank: "Coordinator",
    level: 3
  },
  {
    env: "ROLE_PRM_PRC",
    position: "PR Coordinator",
    department: "Public Relations & Marketing",
    rank: "Associate",
    level: 2
  },
  {
    env: "ROLE_PRM_PRI",
    position: "PR Intern",
    department: "Public Relations & Marketing",
    rank: "Management Intern",
    level: 1
  },

  // Marketing
  {
    env: "ROLE_MARKETING_BM",
    position: "Brand Manager",
    department: "Marketing",
    rank: "General Manager",
    level: 4
  },
  {
    env: "ROLE_MARKETING_SMS",
    position: "Senior Marketing Specialist",
    department: "Marketing",
    rank: "Coordinator",
    level: 3
  },
  {
    env: "ROLE_MARKETING_MS",
    position: "Marketing Specialist",
    department: "Marketing",
    rank: "Associate",
    level: 2
  },
  {
    env: "ROLE_MARKETING_MI",
    position: "Marketing Intern",
    department: "Marketing",
    rank: "Management Intern",
    level: 1
  },

  // Flight Operations
  {
    env: "ROLE_FLIGHT_OPS_SOM",
    position: "Senior Operations Manager",
    department: "Flight Operations",
    rank: "General Manager",
    level: 4
  },
  {
    env: "ROLE_FLIGHT_OPS_FOM",
    position: "Flight Operations Manager",
    department: "Flight Operations",
    rank: "Coordinator",
    level: 3
  },
  {
    env: "ROLE_FLIGHT_OPS_FOI",
    position: "Flight Operations Intern",
    department: "Flight Operations",
    rank: "Management Intern",
    level: 1
  }
];

/* =========================================================
   ROLE RESOLUTION
   ========================================================= */

function resolveRoles(env, discordRoleIds) {
  const roleSet = new Set(discordRoleIds);

  let highestRank = null;

  for (const rank of MAIN_RANKS) {
    for (const [envName, title] of rank.roles) {
      const discordRoleId = env[envName];

      if (discordRoleId && roleSet.has(discordRoleId)) {
        if (!highestRank || rank.level > highestRank.level) {
          highestRank = {
            name: rank.name,
            title,
            level: rank.level,
            portalAccess: rank.portalAccess,
            discordRoleId
          };
        }
      }
    }
  }

  /*
   * Department positions are independently resolved.
   * A staff member can have multiple departments.
   */

  const positions = [];

  for (const position of DEPARTMENT_POSITIONS) {
    const discordRoleId = env[position.env];

    if (discordRoleId && roleSet.has(discordRoleId)) {
      positions.push({
        position: position.position,
        department: position.department,
        rank: position.rank,
        level: position.level,
        discordRoleId
      });
    }
  }

  /*
   * Maximum of two main department positions.
   * Higher-level positions win if a user somehow has more.
   */

  positions.sort((a, b) => b.level - a.level);

  const selectedPositions = positions.slice(0, 2);

  /*
   * Department access can also establish portal access.
   * This is useful for department staff whose main rank role
   * isn't being used as the access signal.
   */

  const departmentPortalAccess = selectedPositions.length > 0;

  const portalAccess =
    Boolean(highestRank?.portalAccess) || departmentPortalAccess;

  /*
   * Permission resolution.
   *
   * This is intentionally centralized so future features
   * can use the same logic.
   */

  const permissions = new Set();

  if (portalAccess) {
    permissions.add("portal.view");
  }

  if (highestRank && highestRank.level >= 3) {
    permissions.add("staff.view");
  }

  if (highestRank && highestRank.level >= 4) {
    permissions.add("staff.manage");
  }

  const hasFlightOps = selectedPositions.some(
    (position) => position.department === "Flight Operations"
  );

  const hasHR = selectedPositions.some(
    (position) => position.department === "Human Resources"
  );

  const hasPRM = selectedPositions.some(
    (position) =>
      position.department === "Public Relations & Marketing" ||
      position.department === "Marketing"
  );

  if (hasFlightOps) {
    permissions.add("flights.view");
    permissions.add("flights.create");
    permissions.add("flights.edit");
  }

  if (hasHR) {
    permissions.add("careers.view");
    permissions.add("staff.view");
  }

  if (hasPRM) {
    permissions.add("announcements.view");
  }

  /*
   * BOD and Leadership receive elevated permissions.
   * We will refine these later as the Admin/BOD system is built.
   */

  if (highestRank && highestRank.level >= 5) {
    permissions.add("flights.manage");
    permissions.add("staff.manage");
    permissions.add("announcements.manage");
    permissions.add("admin.review");
  }

  if (highestRank && highestRank.level >= 6) {
    permissions.add("admin.owner");
  }

  return {
    portalAccess,
    highestRank,
    positions: selectedPositions,
    permissions: [...permissions]
  };
}

/* =========================================================
   DISCORD HELPERS
   ========================================================= */

async function discordRequest(url, options = {}) {
  return fetch(`https://discord.com/api/v10${url}`, {
    ...options,
    headers: {
      Authorization: `Bot ${options.botToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

async function getDiscordUser(accessToken) {
  const response = await fetch("https://discord.com/api/v10/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve Discord user.");
  }

  return response.json();
}

async function getGuildMember(env, userId) {
  const response = await discordRequest(
    `/guilds/${GUILD_ID}/members/${userId}`,
    {
      botToken: env.DISCORD_BOT_TOKEN
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to verify Discord server membership.");
  }

  return response.json();
}

/* =========================================================
   SESSION HELPERS
   ========================================================= */

function makeCookie(name, value) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax"
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

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function randomToken(bytes = 32) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);

  return [...array]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getSession(env, request) {
  const sessionId = getCookie(request, "jet2_session");

  if (!sessionId) {
    return null;
  }

  const session = await env.DB.prepare(
    `
      SELECT
        id,
        user_id,
        expires_at
      FROM auth_sessions
      WHERE id = ?
        AND expires_at > datetime('now')
      LIMIT 1
    `
  )
    .bind(sessionId)
    .first();

  if (!session) {
    return null;
  }

  return {
    ...session,
    sessionId
  };
}

/* =========================================================
   API RESPONSE HELPERS
   ========================================================= */

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}

function redirect(url, headers = {}) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
      ...headers
    }
  });
}

/* =========================================================
   AUTH
   ========================================================= */

async function handleDiscordLogin(env) {
  const state = randomToken(24);

  const authorizeUrl = new URL(
    "https://discord.com/oauth2/authorize"
  );

  authorizeUrl.searchParams.set("client_id", DISCORD_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
  authorizeUrl.searchParams.set(
    "scope",
    "identify guilds guilds.members.read"
  );
  authorizeUrl.searchParams.set("state", state);

  return redirect(authorizeUrl.toString(), {
    "Set-Cookie": makeCookie("jet2_oauth_state", state)
  });
}

async function handleDiscordCallback(env, request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  const storedState = getCookie(request, "jet2_oauth_state");

  if (!code || !returnedState || !storedState || returnedState !== storedState) {
    return new Response("Invalid OAuth state.", {
      status: 400
    });
  }

  const tokenResponse = await fetch(
    "https://discord.com/api/v10/oauth2/token",
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
    return new Response("Discord authentication failed.", {
      status: 401
    });
  }

  const tokenData = await tokenResponse.json();

  const discordUser = await getDiscordUser(tokenData.access_token);

  const member = await getGuildMember(env, discordUser.id);

  if (!member) {
    return new Response(
      "You must be a member of the Jet2 | PTFS Discord server to access the Staff Portal.",
      {
        status: 403
      }
    );
  }

  const resolved = resolveRoles(env, member.roles || []);

  if (!resolved.portalAccess) {
    return new Response(
      "Your Discord account does not currently have Staff Portal access.",
      {
        status: 403
      }
    );
  }

  /*
   * Avatar URL
   */

  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${
        Number(BigInt(discordUser.id) >> 22n) % 6n
      }.png`;

  /*
   * Store/update user.
   *
   * We intentionally keep the stored user record simple.
   * Discord remains the source for current roles.
   */

  await env.DB.prepare(
    `
      INSERT INTO users (
        discord_id,
        username,
        avatar_url,
        updated_at
      )
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(discord_id)
      DO UPDATE SET
        username = excluded.username,
        avatar_url = excluded.avatar_url,
        updated_at = datetime('now')
    `
  )
    .bind(
      discordUser.id,
      discordUser.username,
      avatarUrl
    )
    .run();

  const user = await env.DB.prepare(
    `
      SELECT id
      FROM users
      WHERE discord_id = ?
      LIMIT 1
    `
  )
    .bind(discordUser.id)
    .first();

  if (!user) {
    throw new Error("Unable to create staff user.");
  }

  /*
   * Create a 2-hour server-side session.
   */

  const sessionId = randomToken(32);

  await env.DB.prepare(
    `
      INSERT INTO auth_sessions (
        id,
        user_id,
        expires_at,
        created_at
      )
      VALUES (
        ?,
        ?,
        datetime('now', '+2 hours'),
        datetime('now')
      )
    `
  )
    .bind(sessionId, user.id)
    .run();

  await env.DB.prepare(
    `
      INSERT INTO audit_logs (
        action,
        user_id,
        created_at
      )
      VALUES (?, ?, datetime('now'))
    `
  )
    .bind("staff.login", user.id)
    .run();

  return redirect("/staff", {
    "Set-Cookie": [
      makeCookie("jet2_session", sessionId),
      clearCookie("jet2_oauth_state")
    ].join(", ")
  });
}

/* =========================================================
   CURRENT USER
   ========================================================= */

async function handleMe(env, request) {
  const session = await getSession(env, request);

  if (!session) {
    return json(
      {
        authenticated: false
      },
      401
    );
  }

  const user = await env.DB.prepare(
    `
      SELECT
        id,
        discord_id,
        username,
        avatar_url
      FROM users
      WHERE id = ?
      LIMIT 1
    `
  )
    .bind(session.user_id)
    .first();

  if (!user) {
    return json(
      {
        authenticated: false
      },
      401
    );
  }

  /*
   * Re-check Discord membership and roles every time /me is called.
   * This means removing someone's Discord role can immediately
   * remove their portal access.
   */

  const member = await getGuildMember(env, user.discord_id);

  if (!member) {
    return json(
      {
        authenticated: false,
        reason: "not_a_server_member"
      },
      403
    );
  }

  const resolved = resolveRoles(env, member.roles || []);

  if (!resolved.portalAccess) {
    return json(
      {
        authenticated: false,
        reason: "portal_access_removed"
      },
      403
    );
  }

  return json({
    authenticated: true,

    user: {
      id: user.discord_id,
      username: user.username,
      avatarUrl: user.avatar_url
    },

    /*
     * Highest overall organizational rank.
     * Used internally for permissions.
     */

    rank: resolved.highestRank
      ? {
          name: resolved.highestRank.name,
          title: resolved.highestRank.title,
          level: resolved.highestRank.level
        }
      : null,

    /*
     * User-facing department positions.
     */

    positions: resolved.positions.map((position) => ({
      position: position.position,
      department: position.department,
      rank: position.rank
    })),

    permissions: resolved.permissions
  });
}

/* =========================================================
   LOGOUT
   ========================================================= */

async function handleLogout(env, request) {
  const session = await getSession(env, request);

  if (session) {
    await env.DB.prepare(
      `
        DELETE FROM auth_sessions
        WHERE id = ?
      `
    )
      .bind(session.sessionId)
      .run();

    await env.DB.prepare(
      `
        INSERT INTO audit_logs (
          action,
          user_id,
          created_at
        )
        VALUES (?, ?, datetime('now'))
      `
    )
      .bind("staff.logout", session.user_id)
      .run();
  }

  return redirect("/", {
    "Set-Cookie": clearCookie("jet2_session")
  });
}

/* =========================================================
   STAFF ACCESS
   ========================================================= */

async function handleStaffPage(env, request) {
  const session = await getSession(env, request);

  if (!session) {
    return redirect("/api/auth/discord");
  }

  const user = await env.DB.prepare(
    `
      SELECT discord_id
      FROM users
      WHERE id = ?
      LIMIT 1
    `
  )
    .bind(session.user_id)
    .first();

  if (!user) {
    return redirect("/api/auth/discord", {
      "Set-Cookie": clearCookie("jet2_session")
    });
  }

  /*
   * Re-check the current Discord role state before allowing
   * the protected staff application to load.
   */

  const member = await getGuildMember(env, user.discord_id);

  if (!member) {
    return redirect("/", {
      "Set-Cookie": clearCookie("jet2_session")
    });
  }

  const resolved = resolveRoles(env, member.roles || []);

  if (!resolved.portalAccess) {
    return redirect("/", {
      "Set-Cookie": clearCookie("jet2_session")
    });
  }

  return env.ASSETS.fetch(request);
}

/* =========================================================
   MAIN WORKER
   ========================================================= */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      /*
       * Authentication
       */

      if (
        request.method === "GET" &&
        url.pathname === "/api/auth/discord"
      ) {
        return await handleDiscordLogin(env);
      }

      if (
        request.method === "GET" &&
        url.pathname === "/api/auth/discord/callback"
      ) {
        return await handleDiscordCallback(env, request);
      }

      if (
        request.method === "GET" &&
        url.pathname === "/api/auth/me"
      ) {
        return await handleMe(env, request);
      }

      if (
        request.method === "POST" &&
        url.pathname === "/api/auth/logout"
      ) {
        return await handleLogout(env, request);
      }

      /*
       * Staff portal protection
       */

      if (
        request.method === "GET" &&
        (
          url.pathname === "/staff" ||
          url.pathname.startsWith("/staff/")
        )
      ) {
        return await handleStaffPage(env, request);
      }

      /*
       * Everything else remains public.
       */

      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error(error);

      return json(
        {
          error: "Internal server error."
        },
        500
      );
    }
  }
};
