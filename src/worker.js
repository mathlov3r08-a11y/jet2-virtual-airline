import {
  DISCORD_CLIENT_ID,
  DISCORD_REDIRECT_URI
} from "./auth-config.js";

const GUILD_ID = "1394355545858773003";

/* =========================================================
   DISCORD ROLE IDs
   ========================================================= */

const ROLES = {
  /* Main hierarchy */
  leadership: "1547692976245964800",
  bod: "1545812500417740920",
  generalManager: "1547399646643494922",
  coordinator: "1547398671019016232",
  associate: "1545825580333932717",
  managementIntern: "1545820873305497600",

  /* Leadership positions */
  chm: "1545811527787876452",
  vchm: "1545812090684711053",
  ceo: "1545812226579890186",
  coo: "1545812334759518259",

  /* Board of Directors */
  cdo: "1545819084166275182",
  cto: "1545819157310742568",
  chro: "1545819240127402004",
  cao: "1545819326819344415",
  cmo: "1545819483111956550",
  com: "1545819561905889440",
  cxo: "1545819672203763753",

  /* Human Resources */
  hrm: "1547400202380648509",
  shro: "1547398878221832193",
  hro: "1545825239198605452",
  hrt: "1545820531192762529",

  /* Public Relations */
  prm: "1547400008926761020",
  sprc: "1547399111861469234",
  prc: "1545825281774719147",
  pri: "1545820634712506488",

  /* Marketing */
  bm: "1547400151721709628",
  sms: "1547399234972553317",
  ms: "1545825405737369702",
  mi: "1545820742183165952",

  /* Flight Operations */
  som: "1547399962575372378",
  fom: "1545825156360831125",
  foi: "1545820391346536541"
};

/* =========================================================
   MAIN RANKS
   ========================================================= */

const MAIN_RANKS = [
  {
    name: "Leadership",
    level: 6,
    roleIds: [
      /* Individual leadership ranks come first */
      ROLES.chm,
      ROLES.vchm,
      ROLES.ceo,
      ROLES.coo,

      /* Generic leadership role comes last */
      ROLES.leadership
    ]
  },
  {
    name: "Board of Directors",
    level: 5,
    roleIds: [
      /* Individual BOD ranks come first */
      ROLES.cdo,
      ROLES.cto,
      ROLES.chro,
      ROLES.cao,
      ROLES.cmo,
      ROLES.com,
      ROLES.cxo,

      /* Generic BOD role comes last */
      ROLES.bod
    ]
  },
  {
    name: "General Manager",
    level: 4,
    roleIds: [
      ROLES.generalManager
    ]
  },
  {
    name: "Coordinator",
    level: 3,
    roleIds: [
      ROLES.coordinator
    ]
  },
  {
    name: "Associate",
    level: 2,
    roleIds: [
      ROLES.associate
    ]
  },
  {
    name: "Management Intern",
    level: 1,
    roleIds: [
      ROLES.managementIntern
    ]
  }
];

/* =========================================================
   INDIVIDUAL RANK TITLES
   ========================================================= */

const LEADERSHIP_TITLES = {
  [ROLES.chm]: "CHM",
  [ROLES.vchm]: "VCHM",
  [ROLES.ceo]: "CEO",
  [ROLES.coo]: "COO",

  [ROLES.cdo]: "CDO",
  [ROLES.cto]: "CTO",
  [ROLES.chro]: "CHRO",
  [ROLES.cao]: "CAO",
  [ROLES.cmo]: "CMO",
  [ROLES.com]: "COM",
  [ROLES.cxo]: "CXO"
};

/* =========================================================
   DEPARTMENT POSITIONS
   ========================================================= */

const DEPARTMENT_POSITIONS = [
  {
    roleId: ROLES.hrm,
    position: "Human Resources Manager",
    department: "Human Resources",
    rank: "General Manager",
    level: 4
  },
  {
    roleId: ROLES.shro,
    position: "Senior Human Resources Officer",
    department: "Human Resources",
    rank: "Coordinator",
    level: 3
  },
  {
    roleId: ROLES.hro,
    position: "Human Resources Officer",
    department: "Human Resources",
    rank: "Associate",
    level: 2
  },
  {
    roleId: ROLES.hrt,
    position: "Human Resources Trainee",
    department: "Human Resources",
    rank: "Management Intern",
    level: 1
  },

  {
    roleId: ROLES.prm,
    position: "PR Manager",
    department: "Public Relations & Marketing",
    rank: "General Manager",
    level: 4
  },
  {
    roleId: ROLES.sprc,
    position: "Senior PR Coordinator",
    department: "Public Relations & Marketing",
    rank: "Coordinator",
    level: 3
  },
  {
    roleId: ROLES.prc,
    position: "PR Coordinator",
    department: "Public Relations & Marketing",
    rank: "Associate",
    level: 2
  },
  {
    roleId: ROLES.pri,
    position: "PR Intern",
    department: "Public Relations & Marketing",
    rank: "Management Intern",
    level: 1
  },

  {
    roleId: ROLES.bm,
    position: "Brand Manager",
    department: "Marketing",
    rank: "General Manager",
    level: 4
  },
  {
    roleId: ROLES.sms,
    position: "Senior Marketing Specialist",
    department: "Marketing",
    rank: "Coordinator",
    level: 3
  },
  {
    roleId: ROLES.ms,
    position: "Marketing Specialist",
    department: "Marketing",
    rank: "Associate",
    level: 2
  },
  {
    roleId: ROLES.mi,
    position: "Marketing Intern",
    department: "Marketing",
    rank: "Management Intern",
    level: 1
  },

  {
    roleId: ROLES.som,
    position: "Senior Operations Manager",
    department: "Flight Operations",
    rank: "General Manager",
    level: 4
  },
  {
    roleId: ROLES.fom,
    position: "Flight Operations Manager",
    department: "Flight Operations",
    rank: "Coordinator",
    level: 3
  },
  {
    roleId: ROLES.foi,
    position: "Flight Operations Intern",
    department: "Flight Operations",
    rank: "Management Intern",
    level: 1
  }
];

/* =========================================================
   ROLE RESOLUTION
   ========================================================= */

function resolveRoles(discordRoleIds) {
  const roleSet = new Set(discordRoleIds);

  let highestRank = null;

  for (const rank of MAIN_RANKS) {
    const matchedRole = rank.roleIds.find(
      (roleId) => roleSet.has(roleId)
    );

    if (!matchedRole) {
      continue;
    }

    if (
      !highestRank ||
      rank.level > highestRank.level
    ) {
      highestRank = {
        name: rank.name,
        level: rank.level,
        discordRoleId: matchedRole,
        title:
          LEADERSHIP_TITLES[matchedRole] ||
          rank.name
      };
    }
  }

  const positions = [];

  for (const position of DEPARTMENT_POSITIONS) {
    if (!roleSet.has(position.roleId)) {
      continue;
    }

    positions.push({
      position: position.position,
      department: position.department,
      rank: position.rank,
      level: position.level,
      discordRoleId: position.roleId
    });
  }

  positions.sort(
    (a, b) => b.level - a.level
  );

  const selectedPositions =
    positions.slice(0, 2);

  const portalAccess =
    Boolean(highestRank) ||
    selectedPositions.length > 0;

  const permissions = new Set();

  if (portalAccess) {
    permissions.add("portal.view");
  }

  if (
    highestRank &&
    highestRank.level >= 3
  ) {
    permissions.add("staff.view");
  }

  if (
    highestRank &&
    highestRank.level >= 4
  ) {
    permissions.add("staff.manage");
  }

  const hasFlightOps =
    selectedPositions.some(
      (position) =>
        position.department ===
        "Flight Operations"
    );

  const hasHR =
    selectedPositions.some(
      (position) =>
        position.department ===
        "Human Resources"
    );

  const hasPR =
    selectedPositions.some(
      (position) =>
        position.department ===
        "Public Relations & Marketing"
    );

  const hasMarketing =
    selectedPositions.some(
      (position) =>
        position.department ===
        "Marketing"
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

  if (hasPR || hasMarketing) {
    permissions.add("announcements.view");
  }

  if (
    highestRank &&
    highestRank.level >= 5
  ) {
    permissions.add("flights.manage");
    permissions.add("staff.manage");
    permissions.add("announcements.manage");
    permissions.add("admin.review");
  }

  if (
    highestRank &&
    highestRank.level >= 6
  ) {
    permissions.add("admin.owner");
  }

  return {
    portalAccess,
    highestRank,
    positions: selectedPositions,
    permissions: [
      ...permissions
    ]
  };
}

/* =========================================================
   DISCORD API
   ========================================================= */

async function discordBotRequest(
  env,
  endpoint
) {
  return fetch(
    `https://discord.com/api/v10${endpoint}`,
    {
      headers: {
        Authorization:
          `Bot ${env.DISCORD_BOT_TOKEN}`
      }
    }
  );
}

async function getDiscordUser(
  accessToken
) {
  const response =
    await fetch(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`
        }
      }
    );

  if (!response.ok) {
    throw new Error(
      "Unable to retrieve Discord user."
    );
  }

  return response.json();
}

async function getGuildMember(
  env,
  userId
) {
  const response =
    await discordBotRequest(
      env,
      `/guilds/${GUILD_ID}/members/${userId}`
    );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Unable to verify Discord server membership."
    );
  }

  return response.json();
}

/* =========================================================
   AVATAR
   ========================================================= */

function getDiscordAvatarUrl(
  discordUser
) {
  if (discordUser.avatar) {
    return (
      `https://cdn.discordapp.com/avatars/` +
      `${discordUser.id}/` +
      `${discordUser.avatar}.png?size=256`
    );
  }

  const avatarIndex =
    Number(
      BigInt(discordUser.id) >> 22n
    ) % 6;

  return (
    `https://cdn.discordapp.com/embed/avatars/` +
    `${avatarIndex}.png`
  );
}

/* =========================================================
   COOKIES
   ========================================================= */

function makeCookie(
  name,
  value
) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax"
  ].join("; ");
}

function clearCookie(
  name
) {
  return [
    `${name}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0"
  ].join("; ");
}

function getCookie(
  request,
  name
) {
  const cookieHeader =
    request.headers.get("Cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies =
    cookieHeader
      .split(";")
      .map((cookie) =>
        cookie.trim()
      );

  for (const cookie of cookies) {
    const separator =
      cookie.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key =
      cookie.substring(
        0,
        separator
      );

    const value =
      cookie.substring(
        separator + 1
      );

    if (key === name) {
      return decodeURIComponent(
        value
      );
    }
  }

  return null;
}

/* =========================================================
   RANDOM TOKEN
   ========================================================= */

function randomToken(
  bytes = 32
) {
  const array =
    new Uint8Array(bytes);

  crypto.getRandomValues(
    array
  );

  return Array.from(array)
    .map(
      (byte) =>
        byte
          .toString(16)
          .padStart(2, "0")
    )
    .join("");
}

/* =========================================================
   SESSION
   ========================================================= */

async function getSession(
  env,
  request
) {
  const sessionId =
    getCookie(
      request,
      "jet2_session"
    );

  if (!sessionId) {
    return null;
  }

  const session =
    await env.DB.prepare(
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
   RESPONSES
   ========================================================= */

function json(
  data,
  status = 200
) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8"
      }
    }
  );
}

function redirect(
  url,
  extraHeaders = []
) {
  const headers =
    new Headers();

  headers.set(
    "Location",
    url
  );

  for (
    const [name, value]
    of extraHeaders
  ) {
    headers.append(
      name,
      value
    );
  }

  return new Response(
    null,
    {
      status: 302,
      headers
    }
  );
}

/* =========================================================
   DISCORD LOGIN
   ========================================================= */

async function handleDiscordLogin() {
  const state =
    randomToken(24);

  const authorizeUrl =
    new URL(
      "https://discord.com/oauth2/authorize"
    );

  authorizeUrl.searchParams.set(
    "client_id",
    DISCORD_CLIENT_ID
  );

  authorizeUrl.searchParams.set(
    "response_type",
    "code"
  );

  authorizeUrl.searchParams.set(
    "redirect_uri",
    DISCORD_REDIRECT_URI
  );

  authorizeUrl.searchParams.set(
    "scope",
    "identify guilds guilds.members.read"
  );

  authorizeUrl.searchParams.set(
    "state",
    state
  );

  return redirect(
    authorizeUrl.toString(),
    [
      [
        "Set-Cookie",
        makeCookie(
          "jet2_oauth_state",
          state
        )
      ]
    ]
  );
}

/* =========================================================
   DISCORD CALLBACK
   ========================================================= */

async function handleDiscordCallback(
  env,
  request
) {
  const url =
    new URL(request.url);

  const code =
    url.searchParams.get(
      "code"
    );

  const returnedState =
    url.searchParams.get(
      "state"
    );

  const storedState =
    getCookie(
      request,
      "jet2_oauth_state"
    );

  if (
    !code ||
    !returnedState ||
    !storedState ||
    returnedState !== storedState
  ) {
    return new Response(
      "Invalid OAuth state.",
      {
        status: 400
      }
    );
  }

  const tokenResponse =
    await fetch(
      "https://discord.com/api/v10/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body:
          new URLSearchParams({
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
    return new Response(
      "Discord authentication failed.",
      {
        status: 401
      }
    );
  }

  const tokenData =
    await tokenResponse.json();

  const discordUser =
    await getDiscordUser(
      tokenData.access_token
    );

  const member =
    await getGuildMember(
      env,
      discordUser.id
    );

  if (!member) {
    return new Response(
      "You must be a member of the Jet2 | PTFS Discord server to access the Staff Portal.",
      {
        status: 403
      }
    );
  }

  const resolved =
    resolveRoles(
      member.roles || []
    );

  if (!resolved.portalAccess) {
    return new Response(
      "Your Discord account does not currently have Staff Portal access.",
      {
        status: 403
      }
    );
  }

  /* =======================================================
     UPSERT USER
     ======================================================= */

  await env.DB.prepare(
    `
      INSERT INTO users (
        discord_user_id,
        discord_username,
        updated_at
      )
      VALUES (
        ?,
        ?,
        CURRENT_TIMESTAMP
      )
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

  const user =
    await env.DB.prepare(
      `
        SELECT
          id,
          discord_user_id
        FROM users
        WHERE discord_user_id = ?
        LIMIT 1
      `
    )
      .bind(
        discordUser.id
      )
      .first();

  if (!user) {
    throw new Error(
      "Unable to create staff user."
    );
  }

  /* =======================================================
     CREATE SESSION
     ======================================================= */

  const sessionId =
    randomToken(32);

  await env.DB.prepare(
    `
      INSERT INTO auth_sessions (
        id,
        user_id,
        expires_at
      )
      VALUES (
        ?,
        ?,
        datetime('now', '+2 hours')
      )
    `
  )
    .bind(
      sessionId,
      user.id
    )
    .run();

  /* =======================================================
     AUDIT LOG
     ======================================================= */

  await env.DB.prepare(
    `
      INSERT INTO audit_logs (
        user_id,
        action,
        target_type,
        target_id,
        details
      )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `
  )
    .bind(
      user.id,
      "staff.login",
      "user",
      discordUser.id,
      JSON.stringify({
        rank:
          resolved.highestRank?.name ||
          null,

        title:
          resolved.highestRank?.title ||
          null,

        positions:
          resolved.positions.map(
            (position) =>
              position.position
          )
      })
    )
    .run();

  return redirect(
    "/staff",
    [
      [
        "Set-Cookie",
        makeCookie(
          "jet2_session",
          sessionId
        )
      ],
      [
        "Set-Cookie",
        clearCookie(
          "jet2_oauth_state"
        )
      ]
    ]
  );
}

/* =========================================================
   CURRENT USER
   ========================================================= */

async function handleMe(
  env,
  request
) {
  const session =
    await getSession(
      env,
      request
    );

  if (!session) {
    return json(
      {
        authenticated: false
      },
      401
    );
  }

  const user =
    await env.DB.prepare(
      `
        SELECT
          id,
          discord_user_id,
          discord_username
        FROM users
        WHERE id = ?
        LIMIT 1
      `
    )
      .bind(
        session.user_id
      )
      .first();

  if (!user) {
    return json(
      {
        authenticated: false
      },
      401
    );
  }

  const member =
    await getGuildMember(
      env,
      user.discord_user_id
    );

  if (!member) {
    return json(
      {
        authenticated: false,
        reason:
          "not_a_server_member"
      },
      403
    );
  }

  const resolved =
    resolveRoles(
      member.roles || []
    );

  if (!resolved.portalAccess) {
    return json(
      {
        authenticated: false,
        reason:
          "portal_access_removed"
      },
      403
    );
  }

  const avatarUrl =
    getDiscordAvatarUrl({
      id:
        user.discord_user_id,

      avatar:
        member.user?.avatar
    });

  return json({
    authenticated: true,

    user: {
      id:
        user.discord_user_id,

      username:
        user.discord_username,

      avatarUrl
    },

    rank:
      resolved.highestRank
        ? {
            name:
              resolved.highestRank.name,

            title:
              resolved.highestRank.title,

            level:
              resolved.highestRank.level
          }
        : null,

    positions:
      resolved.positions.map(
        (position) => ({
          position:
            position.position,

          department:
            position.department,

          rank:
            position.rank
        })
      ),

    permissions:
      resolved.permissions
  });
}

/* =========================================================
   LOGOUT
   ========================================================= */

async function handleLogout(
  env,
  request
) {
  const session =
    await getSession(
      env,
      request
    );

  if (session) {
    await env.DB.prepare(
      `
        DELETE FROM auth_sessions
        WHERE id = ?
      `
    )
      .bind(
        session.sessionId
      )
      .run();

    await env.DB.prepare(
      `
        INSERT INTO audit_logs (
          user_id,
          action,
          target_type,
          target_id
        )
        VALUES (
          ?,
          ?,
          ?,
          ?
        )
      `
    )
      .bind(
        session.user_id,
        "staff.logout",
        "session",
        session.sessionId
      )
      .run();
  }

  return redirect(
    "/",
    [
      [
        "Set-Cookie",
        clearCookie(
          "jet2_session"
        )
      ]
    ]
  );
}

/* =========================================================
   STAFF PAGE PROTECTION
   ========================================================= */

async function handleStaffPage(
  env,
  request
) {
  const session =
    await getSession(
      env,
      request
    );

  if (!session) {
    return redirect(
      "/api/auth/discord"
    );
  }

  const user =
    await env.DB.prepare(
      `
        SELECT
          discord_user_id
        FROM users
        WHERE id = ?
        LIMIT 1
      `
    )
      .bind(
        session.user_id
      )
      .first();

  if (!user) {
    return redirect(
      "/",
      [
        [
          "Set-Cookie",
          clearCookie(
            "jet2_session"
          )
        ]
      ]
    );
  }

  const member =
    await getGuildMember(
      env,
      user.discord_user_id
    );

  if (!member) {
    return redirect(
      "/",
      [
        [
          "Set-Cookie",
          clearCookie(
            "jet2_session"
          )
        ]
      ]
    );
  }

  const resolved =
    resolveRoles(
      member.roles || []
    );

  if (!resolved.portalAccess) {
    return redirect(
      "/",
      [
        [
          "Set-Cookie",
          clearCookie(
            "jet2_session"
          )
        ]
      ]
    );
  }

  /*
   * The staff portal is a React SPA.
   *
   * /staff is not a physical static file, so we must
   * serve the application's index.html and let
   * React Router handle /staff and /staff/*.
   */
  const indexRequest =
    new Request(
      new URL(
        "/index.html",
        request.url
      ),
      {
        method: "GET",
        headers: request.headers
      }
    );

  return env.ASSETS.fetch(
    indexRequest
  );
}

/* =========================================================
   WORKER
   ========================================================= */

export default {
  async fetch(
    request,
    env
  ) {
    const url =
      new URL(request.url);

    try {
      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/auth/discord"
      ) {
        return await handleDiscordLogin();
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/auth/discord/callback"
      ) {
        return await handleDiscordCallback(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/auth/me"
      ) {
        return await handleMe(
          env,
          request
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/auth/logout"
      ) {
        return await handleLogout(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        (
          url.pathname === "/staff" ||
          url.pathname.startsWith(
            "/staff/"
          )
        )
      ) {
        return await handleStaffPage(
          env,
          request
        );
      }

      return env.ASSETS.fetch(
        request
      );
    } catch (error) {
      console.error(error);

      return json(
        {
          error:
            "Internal server error."
        },
        500
      );
    }
  }
};
