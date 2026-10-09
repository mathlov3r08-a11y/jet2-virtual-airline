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
  evchm: "1550232742091038860",
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
      ROLES.evchm,
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
  [ROLES.evchm]: "EV-CHM",
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
   OWNER SECURITY
   ========================================================= */

const OWNER_SESSION_COOKIE = "jet2_owner_session";
const OWNER_SESSION_MINUTES = 30;
const OWNER_MAX_FAILED_ATTEMPTS = 5;
const OWNER_LOCKOUT_MINUTES = 15;
const TOTP_STEP_SECONDS = 30;

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
  status = 200,
  extraHeaders = []
) {
  const headers = new Headers({
    "Content-Type":
      "application/json; charset=utf-8"
  });

  for (const [name, value] of extraHeaders) {
    headers.append(name, value);
  }

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers
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

  const myJet2State = getCookie(
    request,
    MYJET2_OAUTH_STATE_COOKIE
  );

  const applicationState = getCookie(
    request,
    APPLICATION_STATE_COOKIE
  );

  if (
    returnedState &&
    applicationState &&
    returnedState === applicationState
  ) {
    return handleApplicationCallback(
      env,
      request
    );
  }

  if (
    returnedState &&
    myJet2State &&
    returnedState === myJet2State &&
    !storedState
  ) {
    return handleMyJet2Callback(
      env,
      request
    );
  }

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
   OWNER SECURITY HELPERS
   ========================================================= */

function isOwnerIdentity(env, user) {
  return Boolean(
    env.OWNER_DISCORD_ID &&
    user &&
    user.discord_user_id === env.OWNER_DISCORD_ID
  );
}

async function getOwnerIdentity(env, request) {
  const session = await getSession(env, request);

  if (!session) {
    return null;
  }

  const user = await env.DB.prepare(
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
    .bind(session.user_id)
    .first();

  if (!user || !isOwnerIdentity(env, user)) {
    return null;
  }

  const member = await getGuildMember(
    env,
    user.discord_user_id
  );

  if (!member) {
    return null;
  }

  const resolved = resolveRoles(member.roles || []);

  if (
    !resolved.portalAccess ||
    !resolved.permissions.includes("admin.owner")
  ) {
    return null;
  }

  return {
    session,
    user,
    member,
    resolved
  };
}

async function getOwnerSession(env, request) {
  const ownerSessionId = getCookie(
    request,
    OWNER_SESSION_COOKIE
  );

  if (!ownerSessionId) {
    return null;
  }

  const ownerSession = await env.DB.prepare(
    `
      SELECT
        id,
        user_id,
        tier,
        expires_at
      FROM privileged_sessions
      WHERE id = ?
        AND tier = 'owner'
        AND expires_at > datetime('now')
      LIMIT 1
    `
  )
    .bind(ownerSessionId)
    .first();

  if (!ownerSession) {
    return null;
  }

  await env.DB.prepare(
    `
      UPDATE privileged_sessions
      SET last_seen_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
  )
    .bind(ownerSessionId)
    .run();

  return {
    ...ownerSession,
    sessionId: ownerSessionId
  };
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function constantTimeEqualBytes(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;

  for (let i = 0; i < a.length; i += 1) {
    difference |= a[i] ^ b[i];
  }

  return difference === 0;
}

async function verifyOwnerPassword(password, storedHash) {
  if (!password || !storedHash) {
    return false;
  }

  const parts = storedHash.split("$");

  if (parts.length !== 4 || parts[0] !== "pbkdf2") {
    return false;
  }

  const iterations = Number(parts[1]);

  if (
    !Number.isInteger(iterations) ||
    iterations <= 0 ||
    !parts[2] ||
    !parts[3]
  ) {
    return false;
  }

  let salt;
  let expected;

  try {
    salt = base64ToBytes(parts[2]);
    expected = base64ToBytes(parts[3]);
  } catch {
    return false;
  }

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    {
      name: "PBKDF2"
    },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256"
    },
    passwordKey,
    expected.length * 8
  );

  return constantTimeEqualBytes(
    new Uint8Array(derivedBits),
    expected
  );
}

function base32ToBytes(value) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const normalized = String(value || "")
    .replace(/\s+/g, "")
    .replace(/=+$/g, "")
    .toUpperCase();

  let buffer = 0;
  let bits = 0;
  const output = [];

  for (const character of normalized) {
    const index = alphabet.indexOf(character);

    if (index === -1) {
      throw new Error("Invalid Base32 secret.");
    }

    buffer = (buffer << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      output.push((buffer >> bits) & 0xff);
    }
  }

  return new Uint8Array(output);
}

function numberToCounterBytes(counter) {
  const bytes = new Uint8Array(8);
  const view = new DataView(bytes.buffer);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;

  view.setUint32(0, high);
  view.setUint32(4, low);

  return bytes;
}

async function generateTotpCode(secret, counter) {
  const key = await crypto.subtle.importKey(
    "raw",
    base32ToBytes(secret),
    {
      name: "HMAC",
      hash: "SHA-1"
    },
    false,
    ["sign"]
  );

  const digest = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      key,
      numberToCounterBytes(counter)
    )
  );

  const offset = digest[digest.length - 1] & 0x0f;

  const binaryCode =
    ((digest[offset] & 0x7f) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3];

  return String(binaryCode % 1000000).padStart(6, "0");
}

async function verifyOwnerTotp(secret, code, lastTotpStep) {
  if (!secret || !/^\d{6}$/.test(String(code || ""))) {
    return null;
  }

  const currentStep = Math.floor(
    Date.now() / 1000 / TOTP_STEP_SECONDS
  );

  const submittedCode = String(code);
  const lastStep =
    lastTotpStep === null || lastTotpStep === undefined
      ? null
      : Number(lastTotpStep);

  for (const offset of [-1, 0, 1]) {
    const step = currentStep + offset;

    if (lastStep !== null && step <= lastStep) {
      continue;
    }

    const expectedCode = await generateTotpCode(
      secret,
      step
    );

    if (expectedCode === submittedCode) {
      return step;
    }
  }

  return null;
}

async function getOwnerSecurityState(env) {
  let state = await env.DB.prepare(
    `
      SELECT
        id,
        failed_attempts,
        locked_until,
        last_totp_step
      FROM owner_security_state
      WHERE id = 1
      LIMIT 1
    `
  ).first();

  if (!state) {
    await env.DB.prepare(
      `
        INSERT OR IGNORE INTO owner_security_state (id)
        VALUES (1)
      `
    ).run();

    state = await env.DB.prepare(
      `
        SELECT
          id,
          failed_attempts,
          locked_until,
          last_totp_step
        FROM owner_security_state
        WHERE id = 1
        LIMIT 1
      `
    ).first();
  }

  return state;
}

function isOwnerLocked(state) {
  if (!state?.locked_until) {
    return false;
  }

  return new Date(
    `${state.locked_until.replace(" ", "T")}Z`
  ).getTime() > Date.now();
}

async function registerOwnerFailure(env) {
  const state = await getOwnerSecurityState(env);
  const failedAttempts =
    Number(state?.failed_attempts || 0) + 1;

  if (failedAttempts >= OWNER_MAX_FAILED_ATTEMPTS) {
    await env.DB.prepare(
      `
        UPDATE owner_security_state
        SET
          failed_attempts = 0,
          locked_until = datetime('now', ?) ,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `
    )
      .bind(`+${OWNER_LOCKOUT_MINUTES} minutes`)
      .run();

    return true;
  }

  await env.DB.prepare(
    `
      UPDATE owner_security_state
      SET
        failed_attempts = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `
  )
    .bind(failedAttempts)
    .run();

  return false;
}

async function clearOwnerFailures(env) {
  await env.DB.prepare(
    `
      UPDATE owner_security_state
      SET
        failed_attempts = 0,
        locked_until = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `
  ).run();
}

async function createOwnerSession(env, userId) {
  const sessionId = randomToken(32);

  await env.DB.prepare(
    `
      INSERT INTO privileged_sessions (
        id,
        user_id,
        tier,
        expires_at
      )
      VALUES (
        ?,
        ?,
        'owner',
        datetime('now', ?)
      )
    `
  )
    .bind(
      sessionId,
      userId,
      `+${OWNER_SESSION_MINUTES} minutes`
    )
    .run();

  return sessionId;
}

async function handleOwnerPasswordDiagnostic(env, request) {
  const identity = await getOwnerIdentity(env, request);

  if (!identity) {
    return json(
      {
        error: "Owner access is not available for this account."
      },
      403
    );
  }

  const storedHash = env.OWNER_PASSWORD_HASH;

  if (typeof storedHash !== "string") {
    return json({
      configured: false,
      type: typeof storedHash
    });
  }

  const parts = storedHash.split("$");

  let saltBytes = null;
  let hashBytes = null;
  let base64PartsValid = false;

  if (parts.length === 4) {
    try {
      saltBytes = base64ToBytes(parts[2]).length;
      hashBytes = base64ToBytes(parts[3]).length;
      base64PartsValid = true;
    } catch {
      base64PartsValid = false;
    }
  }

  let fingerprint = null;

  try {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(storedHash)
    );

    fingerprint = Array.from(
      new Uint8Array(digest)
    )
      .map(
        (byte) =>
          byte
            .toString(16)
            .padStart(2, "0")
      )
      .join("")
      .slice(0, 12);
  } catch {
    fingerprint = null;
  }

  return json({
    configured: true,
    type: "string",
    characterCount: storedHash.length,
    startsWithPbkdf2: storedHash.startsWith("pbkdf2$"),
    partCount: parts.length,
    algorithm: parts[0] || null,
    iterations:
      parts.length === 4
        ? Number(parts[1]) || null
        : null,
    saltBytes,
    hashBytes,
    base64PartsValid,
    hasLeadingWhitespace:
      storedHash !== storedHash.trimStart(),
    hasTrailingWhitespace:
      storedHash !== storedHash.trimEnd(),
    containsWhitespace:
      /\s/.test(storedHash),
    fingerprint
  });
}

async function handleOwnerPasswordVerifierDiagnostic(env, request) {
  const identity = await getOwnerIdentity(env, request);

  if (!identity) {
    return json(
      {
        error: "Owner access is not available for this account."
      },
      403
    );
  }

  /*
   * This is a fixed, non-secret PBKDF2 test vector.
   * It contains no user password, owner password, or Cloudflare secret.
   * The purpose is to prove that the Worker runtime's PBKDF2 verifier
   * produces the expected result using the same algorithm parameters
   * used by OWNER_PASSWORD_HASH.
   */
  const diagnosticPassword = "Jet2OwnerDiagnostic";
  const diagnosticHash =
    "pbkdf2$310000$SmV0MkRpYWdub3N0aWNTYWx0$x23gyQRqxdZ9WqoWPCrdzpaK8uGLC64dyZBEL8/gAKA=";

  let knownGood = false;
  let knownWrong = true;
  let verifierError = null;

  try {
    knownGood = await verifyOwnerPassword(
      diagnosticPassword,
      diagnosticHash
    );

    knownWrong = await verifyOwnerPassword(
      "DefinitelyNotTheDiagnosticPassword",
      diagnosticHash
    );
  } catch (error) {
    verifierError =
      error instanceof Error
        ? error.message
        : "Unknown verifier error.";
  }

  const configuredHash = env.OWNER_PASSWORD_HASH;
  let configured = false;
  let configuredParts = 0;
  let configuredIterations = null;
  let configuredSaltBytes = null;
  let configuredHashBytes = null;
  let configuredBase64Valid = false;

  if (typeof configuredHash === "string") {
    configured = true;
    const parts = configuredHash.split("$");
    configuredParts = parts.length;

    if (parts.length === 4) {
      configuredIterations = Number(parts[1]) || null;

      try {
        configuredSaltBytes = base64ToBytes(parts[2]).length;
        configuredHashBytes = base64ToBytes(parts[3]).length;
        configuredBase64Valid = true;
      } catch {
        configuredBase64Valid = false;
      }
    }
  }

  return json({
    verifierSelfTest: {
      algorithm: "PBKDF2-HMAC-SHA256",
      iterations: 310000,
      expectedHashBytes: 32,
      knownGoodPasswordAccepted: knownGood,
      knownWrongPasswordRejected: !knownWrong,
      passed:
        knownGood === true &&
        knownWrong === false &&
        verifierError === null,
      error: verifierError
    },
    configuredHash: {
      configured,
      startsWithPbkdf2:
        typeof configuredHash === "string" &&
        configuredHash.startsWith("pbkdf2$"),
      partCount: configuredParts,
      iterations: configuredIterations,
      saltBytes: configuredSaltBytes,
      hashBytes: configuredHashBytes,
      base64PartsValid: configuredBase64Valid
    },
    conclusion:
      knownGood === true &&
      knownWrong === false &&
      verifierError === null
        ? "Worker PBKDF2 verifier is functioning correctly."
        : "Worker PBKDF2 verifier self-test failed."
  });
}

async function handleOwnerStatus(env, request) {
  const identity = await getOwnerIdentity(env, request);

  if (!identity) {
    return json(
      {
        eligible: false,
        authenticated: false
      },
      403
    );
  }

  const ownerSession = await getOwnerSession(env, request);

  if (!ownerSession || ownerSession.user_id !== identity.user.id) {
    return json({
      eligible: true,
      authenticated: false
    });
  }

  return json({
    eligible: true,
    authenticated: true,
    expiresAt: ownerSession.expires_at
  });
}

async function handleOwnerLogin(env, request) {
  const identity = await getOwnerIdentity(env, request);

  if (!identity) {
    return json(
      {
        error: "Owner access is not available for this account."
      },
      403
    );
  }

  if (request.method !== "POST") {
    return json(
      {
        error: "Method not allowed."
      },
      405
    );
  }

  const state = await getOwnerSecurityState(env);

  if (isOwnerLocked(state)) {
    return json(
      {
        error: "Owner security is temporarily locked. Please try again later."
      },
      429
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      {
        error: "Invalid request."
      },
      400
    );
  }

  const password =
    typeof body?.password === "string"
      ? body.password
      : "";

  const totp =
    typeof body?.totp === "string"
      ? body.totp.trim()
      : "";

  let passwordValid = false;

  try {
    passwordValid = await verifyOwnerPassword(
      password,
      env.OWNER_PASSWORD_HASH
    );
  } catch (error) {
    console.error("Owner password verification failed:", error);
  }

  if (!passwordValid) {
    const locked = await registerOwnerFailure(env);

    await env.DB.prepare(
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
        identity.user.id,
        "owner.login_failed",
        "owner_security",
        identity.user.discord_user_id,
        JSON.stringify({
          reason: "invalid_password",
          locked
        })
      )
      .run();

    return json(
      {
        error: locked
          ? "Owner security is temporarily locked. Please try again later."
          : "Invalid owner credentials."
      },
      locked ? 429 : 401
    );
  }

  const securityState = await getOwnerSecurityState(env);
  let totpStep = null;

  try {
    totpStep = await verifyOwnerTotp(
      env.OWNER_TOTP_SECRET,
      totp,
      securityState?.last_totp_step
    );
  } catch (error) {
    console.error("Owner TOTP verification failed:", error);
  }

  if (totpStep === null) {
    const locked = await registerOwnerFailure(env);

    await env.DB.prepare(
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
        identity.user.id,
        "owner.login_failed",
        "owner_security",
        identity.user.discord_user_id,
        JSON.stringify({
          reason: "invalid_totp",
          locked
        })
      )
      .run();

    return json(
      {
        error: locked
          ? "Owner security is temporarily locked. Please try again later."
          : "Invalid owner credentials."
      },
      locked ? 429 : 401
    );
  }

  await env.DB.prepare(
    `
      UPDATE owner_security_state
      SET
        failed_attempts = 0,
        locked_until = NULL,
        last_totp_step = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `
  )
    .bind(totpStep)
    .run();

  await env.DB.prepare(
    `
      DELETE FROM privileged_sessions
      WHERE user_id = ?
         OR expires_at <= datetime('now')
    `
  )
    .bind(identity.user.id)
    .run();

  const sessionId = await createOwnerSession(
    env,
    identity.user.id
  );

  await env.DB.prepare(
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
      identity.user.id,
      "owner.login",
      "privileged_session",
      sessionId,
      JSON.stringify({
        tier: "owner"
      })
    )
    .run();

  return json(
    {
      authenticated: true
    },
    200,
    [
      [
        "Set-Cookie",
        makeCookie(OWNER_SESSION_COOKIE, sessionId)
      ]
    ]
  );
}

async function handleOwnerMe(env, request) {
  const identity = await getOwnerIdentity(env, request);

  if (!identity) {
    return json(
      {
        authenticated: false
      },
      403
    );
  }

  const ownerSession = await getOwnerSession(env, request);

  if (!ownerSession || ownerSession.user_id !== identity.user.id) {
    return json(
      {
        authenticated: false
      },
      401
    );
  }

  return json({
    authenticated: true,
    tier: "owner",
    expiresAt: ownerSession.expires_at,
    user: {
      id: identity.user.discord_user_id,
      username: identity.user.discord_username,
      avatarUrl: getDiscordAvatarUrl({
        id: identity.user.discord_user_id,
        avatar: identity.member.user?.avatar
      })
    },
    rank: identity.resolved.highestRank
      ? {
          name: identity.resolved.highestRank.name,
          title: identity.resolved.highestRank.title,
          level: identity.resolved.highestRank.level
        }
      : null
  });
}

async function handleOwnerLogout(env, request) {
  const identity = await getOwnerIdentity(env, request);
  const ownerSession = await getOwnerSession(env, request);

  if (ownerSession) {
    await env.DB.prepare(
      `
        DELETE FROM privileged_sessions
        WHERE id = ?
      `
    )
      .bind(ownerSession.sessionId)
      .run();
  }

  if (identity) {
    await env.DB.prepare(
      `
        INSERT INTO audit_logs (
          user_id,
          action,
          target_type,
          target_id
        )
        VALUES (?, ?, ?, ?)
      `
    )
      .bind(
        identity.user.id,
        "owner.logout",
        "privileged_session",
        ownerSession?.sessionId || null
      )
      .run();
  }

  return json(
    {
      authenticated: false
    },
    200,
    [
      [
        "Set-Cookie",
        clearCookie(OWNER_SESSION_COOKIE)
      ]
    ]
  );
}


/* =========================================================
   OWNER ORGANIZATION
   ========================================================= */

function isValidDiscordUserId(value) {
  return typeof value === "string" && /^\d{17,20}$/.test(value.trim());
}

function normalizeOrganizationGroup(value) {
  return ["leadership", "bod", "directors"].includes(value)
    ? value
    : null;
}

function normalizeOrganizationStatus(value) {
  return ["current", "past"].includes(value)
    ? value
    : null;
}

function normalizeCustomPhotoUrl(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

async function resolveOrganizationPhoto(env, person) {
  if (person.custom_photo_url) {
    return person.custom_photo_url;
  }

  try {
    const member = await getGuildMember(
      env,
      person.discord_user_id
    );

    if (member) {
      return getDiscordAvatarUrl({
        id: person.discord_user_id,
        avatar: member.user?.avatar
      });
    }
  } catch (error) {
    console.error(
      "Unable to resolve organization Discord avatar:",
      error
    );
  }

  return null;
}

async function serializeOrganizationPerson(env, person) {
  return {
    id: person.id,
    discordUserId: person.discord_user_id,
    displayName: person.display_name,
    positionTitle: person.position_title,
    groupType: person.group_type,
    status: person.status,
    displayOrder: person.display_order,
    description: person.description || "",
    customPhotoUrl: person.custom_photo_url || "",
    photoUrl: await resolveOrganizationPhoto(env, person),
    createdAt: person.created_at,
    updatedAt: person.updated_at
  };
}

async function handleOwnerOrganization(env, request) {
  const owner = await requireOwnerSession(env, request);

  if (!owner) {
    return json(
      { error: "Owner authentication required." },
      401
    );
  }

  if (request.method === "GET") {
    const rows = await env.DB.prepare(
      `
        SELECT
          id,
          discord_user_id,
          display_name,
          position_title,
          group_type,
          status,
          display_order,
          description,
          custom_photo_url,
          created_at,
          updated_at
        FROM organization_people
        ORDER BY
          CASE group_type
            WHEN 'leadership' THEN 1
            WHEN 'bod' THEN 2
            WHEN 'directors' THEN 3
            ELSE 4
          END,
          CASE status
            WHEN 'current' THEN 1
            ELSE 2
          END,
          display_order ASC,
          id ASC
      `
    ).all();

    const people = [];

    for (const row of rows.results || []) {
      people.push(
        await serializeOrganizationPerson(env, row)
      );
    }

    return json({ people });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (request.method === "POST") {
    const discordUserId =
      typeof body?.discordUserId === "string"
        ? body.discordUserId.trim()
        : "";
    const displayName =
      typeof body?.displayName === "string"
        ? body.displayName.trim()
        : "";
    const positionTitle =
      typeof body?.positionTitle === "string"
        ? body.positionTitle.trim()
        : "";
    const groupType = normalizeOrganizationGroup(
      body?.groupType
    );
    const status =
      normalizeOrganizationStatus(body?.status) ||
      "current";
    const displayOrder = Number.isFinite(
      Number(body?.displayOrder)
    )
      ? Math.max(0, Math.trunc(Number(body.displayOrder)))
      : 0;
    const description =
      typeof body?.description === "string"
        ? body.description.trim()
        : "";
    const customPhotoUrl = normalizeCustomPhotoUrl(
      body?.customPhotoUrl
    );

    if (!isValidDiscordUserId(discordUserId)) {
      return json({ error: "Enter a valid Discord user ID." }, 400);
    }

    if (!displayName || !positionTitle) {
      return json({ error: "Display name and position are required." }, 400);
    }

    if (!groupType) {
      return json({ error: "Choose a valid organization group." }, 400);
    }

    if (body?.customPhotoUrl && !customPhotoUrl) {
      return json({ error: "Custom photo URL must use HTTP or HTTPS." }, 400);
    }

    const result = await env.DB.prepare(
      `
        INSERT INTO organization_people (
          discord_user_id,
          display_name,
          position_title,
          group_type,
          status,
          display_order,
          description,
          custom_photo_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
      .bind(
        discordUserId,
        displayName,
        positionTitle,
        groupType,
        status,
        displayOrder,
        description || null,
        customPhotoUrl
      )
      .run();

    await env.DB.prepare(
      `
        INSERT INTO audit_logs (
          user_id, action, target_type, target_id, details
        )
        VALUES (?, ?, ?, ?, ?)
      `
    )
      .bind(
        owner.user.id,
        "organization.person.create",
        "organization_person",
        String(result.meta?.last_row_id || ""),
        JSON.stringify({
          discordUserId,
          positionTitle,
          groupType,
          status
        })
      )
      .run();

    return json({
      success: true,
      id: result.meta?.last_row_id || null
    }, 201);
  }

  if (request.method === "PUT") {
    const id = Number(body?.id);

    if (!Number.isInteger(id) || id < 1) {
      return json({ error: "Invalid organization record ID." }, 400);
    }

    const discordUserId =
      typeof body?.discordUserId === "string"
        ? body.discordUserId.trim()
        : "";
    const displayName =
      typeof body?.displayName === "string"
        ? body.displayName.trim()
        : "";
    const positionTitle =
      typeof body?.positionTitle === "string"
        ? body.positionTitle.trim()
        : "";
    const groupType = normalizeOrganizationGroup(
      body?.groupType
    );
    const status = normalizeOrganizationStatus(
      body?.status
    );
    const displayOrder = Number.isFinite(
      Number(body?.displayOrder)
    )
      ? Math.max(0, Math.trunc(Number(body.displayOrder)))
      : 0;
    const description =
      typeof body?.description === "string"
        ? body.description.trim()
        : "";
    const customPhotoUrl = normalizeCustomPhotoUrl(
      body?.customPhotoUrl
    );

    if (!isValidDiscordUserId(discordUserId)) {
      return json({ error: "Enter a valid Discord user ID." }, 400);
    }

    if (!displayName || !positionTitle || !groupType || !status) {
      return json({ error: "Display name, position, group and status are required." }, 400);
    }

    if (body?.customPhotoUrl && !customPhotoUrl) {
      return json({ error: "Custom photo URL must use HTTP or HTTPS." }, 400);
    }

    const result = await env.DB.prepare(
      `
        UPDATE organization_people
        SET
          discord_user_id = ?,
          display_name = ?,
          position_title = ?,
          group_type = ?,
          status = ?,
          display_order = ?,
          description = ?,
          custom_photo_url = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    )
      .bind(
        discordUserId,
        displayName,
        positionTitle,
        groupType,
        status,
        displayOrder,
        description || null,
        customPhotoUrl,
        id
      )
      .run();

    if (!result.meta?.changes) {
      return json({ error: "Organization record not found." }, 404);
    }

    await env.DB.prepare(
      `
        INSERT INTO audit_logs (
          user_id, action, target_type, target_id, details
        )
        VALUES (?, ?, ?, ?, ?)
      `
    )
      .bind(
        owner.user.id,
        "organization.person.update",
        "organization_person",
        String(id),
        JSON.stringify({
          discordUserId,
          positionTitle,
          groupType,
          status
        })
      )
      .run();

    return json({ success: true });
  }

  if (request.method === "DELETE") {
    const id = Number(body?.id);

    if (!Number.isInteger(id) || id < 1) {
      return json({ error: "Invalid organization record ID." }, 400);
    }

    const result = await env.DB.prepare(
      `
        UPDATE organization_people
        SET
          status = 'past',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND status = 'current'
      `
    )
      .bind(id)
      .run();

    if (!result.meta?.changes) {
      return json({ error: "Current organization record not found." }, 404);
    }

    await env.DB.prepare(
      `
        INSERT INTO audit_logs (
          user_id, action, target_type, target_id, details
        )
        VALUES (?, ?, ?, ?, ?)
      `
    )
      .bind(
        owner.user.id,
        "organization.person.archive",
        "organization_person",
        String(id),
        JSON.stringify({ status: "past" })
      )
      .run();

    return json({ success: true });
  }

  return json({ error: "Method not allowed." }, 405);
}

async function requireOwnerSession(env, request) {
  const identity = await getOwnerIdentity(env, request);

  if (!identity) {
    return null;
  }

  const ownerSession = await getOwnerSession(env, request);

  if (
    !ownerSession ||
    ownerSession.user_id !== identity.user.id
  ) {
    return null;
  }

  return {
    ...identity,
    ownerSession
  };
}

async function handleOwnerPage(env, request) {
  const identity = await getOwnerIdentity(env, request);

  if (!identity) {
    return redirect("/staff");
  }

  const indexRequest = new Request(
    new URL("/index.html", request.url),
    {
      method: "GET",
      headers: request.headers
    }
  );

  return env.ASSETS.fetch(indexRequest);
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
   APPLICATION SYSTEM
   ========================================================= */

const APPLICATION_STATE_COOKIE = "jet2_application_oauth_state";
const APPLICATION_DRAFT_COOKIE = "jet2_application_draft";

const APPLICATION_REVIEW_ROLES = {
  hr: [ROLES.hrm, ROLES.shro, ROLES.hro],
  pr: [ROLES.prm, ROLES.sprc, ROLES.prc, ROLES.bm, ROLES.sms, ROLES.ms],
  flight_ops: [ROLES.som, ROLES.fom],
  management: [ROLES.generalManager, ROLES.coordinator]
};

function applicationHasReviewerRole(member, reviewerGroup) {
  const roles = new Set(member?.roles || []);
  if (roles.has(ROLES.leadership) || roles.has(ROLES.bod)) return true;
  return (APPLICATION_REVIEW_ROLES[reviewerGroup] || []).some((roleId) => roles.has(roleId));
}

function applicationAnswersAreValid(questions, answers) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return false;

  for (const question of questions) {
    const value = typeof answers[String(question.id)] === "string"
      ? answers[String(question.id)].trim()
      : "";

    if (question.required && !value) return false;
    if (value.length > Number(question.max_length || 1500)) return false;
  }

  return true;
}

function applicationPublicId() {
  return `J2-${randomToken(5).toUpperCase()}`;
}

function truncateDiscordText(value, max = 1024) {
  const text = String(value ?? "");
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}â€¦`;
}

async function getApplicationType(env, typeKey) {
  return env.DB.prepare(
    `
      SELECT id, type_key, name, description, department, reviewer_group, active
      FROM application_types
      WHERE type_key = ?
        AND active = 1
      LIMIT 1
    `
  ).bind(typeKey).first();
}

async function getApplicationQuestions(env, applicationTypeId) {
  const result = await env.DB.prepare(
    `
      SELECT id, question_order, prompt, help_text, required, max_length
      FROM application_questions
      WHERE application_type_id = ?
        AND active = 1
      ORDER BY question_order ASC
    `
  ).bind(applicationTypeId).all();

  return result.results || [];
}

async function handleApplicationTypes(env) {
  const result = await env.DB.prepare(
    `
      SELECT
        t.id,
        t.type_key,
        t.name,
        t.description,
        t.department,
        t.reviewer_group,
        q.id AS question_id,
        q.question_order,
        q.prompt,
        q.help_text,
        q.required,
        q.max_length
      FROM application_types t
      LEFT JOIN application_questions q
        ON q.application_type_id = t.id
       AND q.active = 1
      WHERE t.active = 1
      ORDER BY t.id ASC, q.question_order ASC
    `
  ).all();

  const map = new Map();
  for (const row of result.results || []) {
    if (!map.has(row.type_key)) {
      map.set(row.type_key, {
        id: row.id,
        typeKey: row.type_key,
        name: row.name,
        description: row.description,
        department: row.department,
        questions: []
      });
    }

    if (row.question_id) {
      map.get(row.type_key).questions.push({
        id: row.question_id,
        order: row.question_order,
        prompt: row.prompt,
        helpText: row.help_text,
        required: Boolean(row.required),
        maxLength: row.max_length
      });
    }
  }

  return json({ applications: [...map.values()] });
}

async function handleApplicationStart(env, request) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const body = await request.json().catch(() => null);
  const typeKey = String(body?.typeKey || "").trim();
  const answers = body?.answers;

  const type = await getApplicationType(env, typeKey);
  if (!type) return json({ error: "That application is not currently available." }, 404);

  const questions = await getApplicationQuestions(env, type.id);
  if (!questions.length) return json({ error: "This application has no questions configured yet." }, 409);

  if (!applicationAnswersAreValid(questions, answers)) {
    return json({ error: "Please complete every required question and stay within the stated limits." }, 400);
  }

  const publicId = applicationPublicId();

  await env.DB.prepare(
    `
      INSERT INTO applications (
        public_id,
        application_type_id,
        status,
        answers_json
      )
      VALUES (?, ?, 'awaiting_discord', ?)
    `
  ).bind(publicId, type.id, JSON.stringify(answers)).run();

  const state = randomToken(24);
  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", DISCORD_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
  authorizeUrl.searchParams.set("scope", "identify guilds.members.read");
  authorizeUrl.searchParams.set("state", state);

  return json({
    ok: true,
    authorizationUrl: authorizeUrl.toString()
  }, 200, [
    ["Set-Cookie", makeCookie(APPLICATION_STATE_COOKIE, state)],
    ["Set-Cookie", makeCookie(APPLICATION_DRAFT_COOKIE, publicId)]
  ]);
}

async function handleApplicationCallback(env, request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const storedState = getCookie(request, APPLICATION_STATE_COOKIE);
  const draftId = getCookie(request, APPLICATION_DRAFT_COOKIE);

  const clearApplicationCookies = [
    ["Set-Cookie", clearCookie(APPLICATION_STATE_COOKIE)],
    ["Set-Cookie", clearCookie(APPLICATION_DRAFT_COOKIE)]
  ];

  if (!code || !returnedState || !storedState || returnedState !== storedState || !draftId) {
    return new Response("Invalid application OAuth state.", { status: 400, headers: new Headers(clearApplicationCookies) });
  }

  const application = await env.DB.prepare(
    `
      SELECT
        a.id,
        a.public_id,
        a.status,
        a.answers_json,
        t.id AS application_type_id,
        t.type_key,
        t.name,
        t.description,
        t.department,
        t.reviewer_group
      FROM applications a
      JOIN application_types t ON t.id = a.application_type_id
      WHERE a.public_id = ?
      LIMIT 1
    `
  ).bind(draftId).first();

  if (!application || application.status !== "awaiting_discord") {
    return redirect("/apply?error=application_expired", clearApplicationCookies);
  }

  const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI
    })
  });

  if (!tokenResponse.ok) {
    return new Response("Discord authentication failed.", { status: 401, headers: new Headers(clearApplicationCookies) });
  }

  const tokenData = await tokenResponse.json();
  const discordUser = await getDiscordUser(tokenData.access_token);
  const member = await getGuildMember(env, discordUser.id);

  if (!member) {
    return redirect("/apply?error=not_a_member", clearApplicationCookies);
  }

  const duplicate = await env.DB.prepare(
    `
      SELECT public_id
      FROM applications
      WHERE discord_user_id = ?
        AND application_type_id = ?
        AND status IN ('awaiting_discord', 'submitted', 'under_review')
      LIMIT 1
    `
  ).bind(discordUser.id, application.application_type_id).first();

  if (duplicate && duplicate.public_id !== application.public_id) {
    return redirect("/apply?error=already_applied", clearApplicationCookies);
  }

  const questions = await getApplicationQuestions(env, application.application_type_id);
  const answers = JSON.parse(application.answers_json || "{}");

  if (!applicationAnswersAreValid(questions, answers)) {
    return redirect("/apply?error=invalid_answers", clearApplicationCookies);
  }

  const fields = questions.map((question) => ({
    name: truncateDiscordText(`${question.question_order}. ${question.prompt}`, 256),
    value: truncateDiscordText(answers[String(question.id)] || "No answer provided.", 1024),
    inline: false
  }));

  const forumChannelId = env.APPLICATION_FORUM_CHANNEL_ID || "1557934152828063874";
  const resultsChannelId = env.APPLICATION_RESULTS_CHANNEL_ID || "1536053234760941578";

  if (!forumChannelId || !resultsChannelId || !env.DISCORD_BOT_TOKEN) {
    throw new Error("Application Discord configuration is incomplete.");
  }

  const initialContent = [
    `# ${application.name} application`,
    `**Applicant:** ${discordUser.username}`,
    `**Discord ID:** ${discordUser.id}`,
    `**Application ID:** ${application.public_id}`,
    "",
    "Use the buttons below to review this application."
  ].join("\\n");

  const forumResponse = await discordBotRequestWithJson(env, `/channels/${forumChannelId}/threads`, {
    method: "POST",
    body: JSON.stringify({
      name: truncateDiscordText(`${application.name} â€” ${discordUser.username}`, 100),
      message: {
        content: initialContent,
        embeds: [{
          title: `Jet2 | PTFS â€” ${application.name}`,
          description: application.description,
          color: 0xd71920,
          fields,
          footer: { text: `${application.public_id} â€¢ Verified Discord member` },
          timestamp: new Date().toISOString()
        }],
        
components: [{
  type: 1,
  components: [
    { type: 2, style: 3, label: "Pass Application", custom_id: `application:pass:${application.public_id}` },
    { type: 2, style: 4, label: "Fail Application", custom_id: `application:fail:${application.public_id}` }
  ]
}]
      }
    })
  });

  if (!forumResponse.ok) {

  if (!forumResponse.ok) {
    const errorText = await forumResponse.text();
    throw new Error(`Discord forum creation failed: ${errorText}`);
  }

  const forumThread = await forumResponse.json();

  await env.DB.prepare(
    `
      UPDATE applications
      SET
        status = 'submitted',
        discord_user_id = ?,
        discord_username = ?,
        discord_global_name = ?,
        forum_thread_id = ?,
        submitted_at = CURRENT_TIMESTAMP
      WHERE public_id = ?
    `
  ).bind(
    discordUser.id,
    discordUser.username,
    discordUser.global_name || "",
    forumThread.id,
    application.public_id
  ).run();

  return redirect(`/apply?submitted=1&id=${encodeURIComponent(application.public_id)}`, clearApplicationCookies);
}

async function discordBotRequestWithJson(env, endpoint, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bot ${env.DISCORD_BOT_TOKEN}`);
  headers.set("Content-Type", "application/json");
  return fetch(`https://discord.com/api/v10${endpoint}`, { ...options, headers });
}

function hexToBytes(hex) {
  const clean = String(hex || "").trim();
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function verifyDiscordInteraction(request, env, rawBody) {
  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");
  const publicKey = env.DISCORD_PUBLIC_KEY || "bc89fb377421963849f5fffd5eac04f8a7724a17f311fce5b107b3cf83d9690b";
  if (!signature || !timestamp || !publicKey) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      hexToBytes(publicKey),
      { name: "Ed25519" },
      false,
      ["verify"]
    );

    return await crypto.subtle.verify(
      "Ed25519",
      key,
      hexToBytes(signature),
      new TextEncoder().encode(timestamp + rawBody)
    );
  } catch (error) {
    console.error("Discord interaction verification failed:", error);
    return false;
  }
}

async function handleApplicationInteraction(env, request) {
  const rawBody = await request.text();
  if (!(await verifyDiscordInteraction(request, env, rawBody))) {
    return new Response("Invalid request signature.", { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  if (interaction.type === 1) {
    return json({ type: 1 });
  }

  if (interaction.type !== 3) {
    return json({ type: 4, data: { content: "Unsupported interaction.", flags: 64 } });
  }

  const customId = String(interaction.data?.custom_id || "");
  const match = customId.match(/^application:(pass|fail):(.+)$/);
  if (!match) return json({ type: 4, data: { content: "Unknown application action.", flags: 64 } });

  const decision = match[1] === "pass" ? "passed" : "failed";
  const publicId = match[2];
  const reviewerId = interaction.member?.user?.id;
  const reviewerUsername = interaction.member?.user?.username || "Staff Member";

  const application = await env.DB.prepare(
    `
      SELECT
        a.*,
        t.name,
        t.reviewer_group
      FROM applications a
      JOIN application_types t ON t.id = a.application_type_id
      WHERE a.public_id = ?
      LIMIT 1
    `
  ).bind(publicId).first();

  if (!application) return json({ type: 4, data: { content: "Application not found.", flags: 64 } });
  if (!reviewerId) return json({ type: 4, data: { content: "Unable to verify your staff identity.", flags: 64 } });
  if (application.status === "decided") return json({ type: 4, data: { content: "This application has already been decided.", flags: 64 } });

  if (!applicationHasReviewerRole(interaction.member, application.reviewer_group)) {
    return json({ type: 4, data: { content: "You are not authorized to review this application.", flags: 64 } });
  }

  await env.DB.prepare(
    `
      UPDATE applications
      SET
        status = 'decided',
        decision = ?,
        reviewer_discord_user_id = ?,
        reviewer_username = ?,
        decided_at = CURRENT_TIMESTAMP
      WHERE public_id = ?
    `
  ).bind(decision, reviewerId, reviewerUsername, publicId).run();

  const applicantMessage = decision === "passed"
    ? `ðŸŽ‰ **Your ${application.name} application has been accepted!**\\n\\nYour application **${publicId}** has been approved by **${reviewerUsername}**. A member of the team will provide any next steps in Discord.`
    : `Thank you for applying to **Jet2 | PTFS**.\\n\\nYour **${application.name}** application (${publicId}) was not successful this time. You are welcome to apply again when the relevant application opens again.`;

  if (application.discord_user_id) {
    try {
      const dmChannelResponse = await discordBotRequestWithJson(env, "/users/@me/channels", {
        method: "POST",
        body: JSON.stringify({ recipient_id: application.discord_user_id })
      });
      if (dmChannelResponse.ok) {
        const dmChannel = await dmChannelResponse.json();
        await discordBotRequestWithJson(env, `/channels/${dmChannel.id}/messages`, {
          method: "POST",
          body: JSON.stringify({ content: applicantMessage })
        });
      }
    } catch (error) {
      console.error("Unable to DM application result:", error);
    }
  }

  if (env.APPLICATION_RESULTS_CHANNEL_ID) {
    await discordBotRequestWithJson(env, `/channels/${env.APPLICATION_RESULTS_CHANNEL_ID}/messages`, {
      method: "POST",
      body: JSON.stringify({
        embeds: [{
          title: `Application ${decision === "passed" ? "Passed" : "Failed"}`,
          description: `${application.name} â€” ${publicId}`,
          color: decision === "passed" ? 0x22c55e : 0xd71920,
          fields: [
            { name: "Applicant", value: `<@${application.discord_user_id}>`, inline: true },
            { name: "Reviewed by", value: reviewerUsername, inline: true },
            { name: "Decision", value: decision === "passed" ? "Passed" : "Failed", inline: true }
          ],
          timestamp: new Date().toISOString()
        }]
      })
    });
  }

  if (application.forum_thread_id) {
    await discordBotRequestWithJson(env, `/channels/${application.forum_thread_id}/messages/${application.forum_thread_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        components: [{
          type: 1,
          components: [
            { type: 2, style: decision === "passed" ? 3 : 4, label: decision === "passed" ? "Application Passed" : "Application Failed", custom_id: `application:${decision}:result`, disabled: true }
          ]
        ]
      })
    });
  }

  return json({
    type: 4,
    data: {
      content: `Application **${publicId}** marked **${decision === "passed" ? "PASSED" : "FAILED"}**. The applicant has been notified.`,
      flags: 64
    }
  });
}

/* =========================================================
   MYJET2 PASSENGER AUTH + CORE API
   ========================================================= */

const MYJET2_SESSION_COOKIE = "jet2_myjet2_session";
const MYJET2_OAUTH_STATE_COOKIE = "jet2_myjet2_oauth_state";
const MYJET2_SIGNUP_USERNAME_COOKIE = "jet2_myjet2_signup_username";
const MYJET2_SESSION_HOURS = 24;
const MYJET2_USERNAME_PATTERN = /^[A-Za-z0-9 _-]{3,20}$/;

function getMyJet2SessionId(request) {
  return getCookie(request, MYJET2_SESSION_COOKIE);
}

async function getAuthenticatedUserBySessionId(env, sessionId) {
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

  const user = await env.DB.prepare(
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
    .bind(session.user_id)
    .first();

  if (!user) {
    return null;
  }

  const member = await getGuildMember(
    env,
    user.discord_user_id
  );

  if (!member) {
    return null;
  }

  return {
    session,
    user,
    member
  };
}

async function getMyJet2Identity(env, request) {
  const passengerSessionId = getMyJet2SessionId(request);
  const passengerIdentity = await getAuthenticatedUserBySessionId(
    env,
    passengerSessionId
  );

  if (passengerIdentity) {
    return passengerIdentity;
  }

  const staffSession = await getSession(env, request);

  if (!staffSession) {
    return null;
  }

  return getAuthenticatedUserBySessionId(
    env,
    staffSession.sessionId
  );
}

async function ensureMyJet2Account(
  env,
  userId,
  username = null
) {
  await env.DB.prepare(
    `
      INSERT OR IGNORE INTO myjet2_accounts (
        user_id,
        username,
        points_balance,
        status
      )
      VALUES (?, ?, 0, 'active')
    `
  )
    .bind(userId, username)
    .run();

  return env.DB.prepare(
    `
      SELECT
        a.id,
        a.user_id,
        a.username,
        a.points_balance,
        a.tier_id,
        a.status,
        a.created_at,
        a.updated_at,
        t.tier_key,
        t.name AS tier_name,
        t.minimum_points AS tier_minimum_points,
        t.description AS tier_description
      FROM myjet2_accounts a
      LEFT JOIN myjet2_tiers t
        ON t.id = a.tier_id
      WHERE a.user_id = ?
      LIMIT 1
    `
  )
    .bind(userId)
    .first();
}

async function refreshMyJet2Tier(env, account) {
  if (!account) {
    return null;
  }

  const tier = await env.DB.prepare(
    `
      SELECT
        id,
        tier_key,
        name,
        minimum_points,
        description,
        display_order
      FROM myjet2_tiers
      WHERE active = 1
        AND minimum_points <= ?
      ORDER BY
        minimum_points DESC,
        display_order ASC,
        id ASC
      LIMIT 1
    `
  )
    .bind(account.points_balance)
    .first();

  const tierId = tier?.id ?? null;

  if (Number(account.tier_id || 0) !== Number(tierId || 0)) {
    await env.DB.prepare(
      `
        UPDATE myjet2_accounts
        SET
          tier_id = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    )
      .bind(tierId, account.id)
      .run();

    account.tier_id = tierId;
  }

  return tier;
}

function serializeMyJet2Account(account, tier) {
  return {
    id: account.id,
    username: account.username || null,
    pointsBalance: Number(account.points_balance || 0),
    status: account.status,
    tier: tier
      ? {
          id: tier.id,
          key: tier.tier_key,
          name: tier.name,
          minimumPoints: Number(tier.minimum_points || 0),
          description: tier.description || "",
          displayOrder: Number(tier.display_order || 0)
        }
      : null,
    createdAt: account.created_at,
    updatedAt: account.updated_at
  };
}

async function getMyJet2Perks(env, accountId) {
  const result = await env.DB.prepare(
    `
      SELECT
        p.id,
        p.perk_key,
        p.name,
        p.description,
        p.points_cost,
        p.acquisition_type,
        p.redemption_type,
        p.active,
        p.display_order,
        p.metadata_json,
        ap.id AS account_perk_id,
        ap.status AS account_perk_status,
        ap.granted_source,
        ap.granted_at,
        ap.expires_at
      FROM myjet2_perks p
      LEFT JOIN myjet2_account_perks ap
        ON ap.perk_id = p.id
       AND ap.account_id = ?
       AND ap.status IN ('unlocked', 'active')
      WHERE p.active = 1
      ORDER BY
        p.display_order ASC,
        p.id ASC
    `
  )
    .bind(accountId)
    .all();

  return (result.results || []).map((row) => ({
    id: row.id,
    key: row.perk_key,
    name: row.name,
    description: row.description || "",
    pointsCost: Number(row.points_cost || 0),
    acquisitionType: row.acquisition_type,
    redemptionType: row.redemption_type,
    metadata: row.metadata_json
      ? safeJsonParse(row.metadata_json, null)
      : null,
    owned: Boolean(row.account_perk_id),
    accountPerk: row.account_perk_id
      ? {
          id: row.account_perk_id,
          status: row.account_perk_status,
          grantedSource: row.granted_source,
          grantedAt: row.granted_at,
          expiresAt: row.expires_at
        }
      : null
  }));
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getMyJet2Transactions(env, accountId) {
  const result = await env.DB.prepare(
    `
      SELECT
        id,
        amount,
        transaction_type,
        source,
        description,
        reference_type,
        reference_id,
        balance_after,
        created_at
      FROM myjet2_points_transactions
      WHERE account_id = ?
      ORDER BY id DESC
      LIMIT 25
    `
  )
    .bind(accountId)
    .all();

  return (result.results || []).map((row) => ({
    id: row.id,
    amount: Number(row.amount),
    type: row.transaction_type,
    source: row.source,
    description: row.description || "",
    referenceType: row.reference_type,
    referenceId: row.reference_id,
    balanceAfter: Number(row.balance_after),
    createdAt: row.created_at
  }));
}

async function handleMyJet2Login(env, request) {
  const url = new URL(request.url);
  const rawUsername = url.searchParams.get("username");
  const username = rawUsername ? rawUsername.trim() : null;

  if (username && !MYJET2_USERNAME_PATTERN.test(username)) {
    return new Response(
      "Invalid myJet2 username. Use 3â€“20 letters, numbers, spaces, hyphens, or underscores.",
      { status: 400 }
    );
  }

  if (username) {
    const taken = await env.DB.prepare(
      `SELECT id FROM myjet2_accounts WHERE username = ? COLLATE NOCASE LIMIT 1`
    )
      .bind(username)
      .first();

    if (taken) {
      return new Response(
        "That myJet2 username is already taken.",
        { status: 409 }
      );
    }
  }

  const state = randomToken(24);
  const authorizeUrl = new URL(
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
    "identify"
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
          MYJET2_OAUTH_STATE_COOKIE,
          state
        )
      ],
      ...(username
        ? [
            [
              "Set-Cookie",
              makeCookie(
                MYJET2_SIGNUP_USERNAME_COOKIE,
                username
              )
            ]
          ]
        : [])
    ]
  );
}

async function handleMyJet2Callback(env, request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const storedState = getCookie(
    request,
    MYJET2_OAUTH_STATE_COOKIE
  );
  const signupUsername = getCookie(
    request,
    MYJET2_SIGNUP_USERNAME_COOKIE
  );

  if (
    !code ||
    !returnedState ||
    !storedState ||
    returnedState !== storedState
  ) {
    return new Response(
      "Invalid myJet2 OAuth state.",
      { status: 400 }
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
        client_id: DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI
      })
    }
  );

  if (!tokenResponse.ok) {
    return new Response(
      "Discord authentication failed.",
      { status: 401 }
    );
  }

  const tokenData = await tokenResponse.json();
  const discordUser = await getDiscordUser(
    tokenData.access_token
  );
  const member = await getGuildMember(
    env,
    discordUser.id
  );

  if (!member) {
    return new Response(
      "You must be a member of the Jet2 | PTFS Discord server to use myJet2.",
      { status: 403 }
    );
  }

  await env.DB.prepare(
    `
      INSERT INTO users (
        discord_user_id,
        discord_username,
        updated_at
      )
      VALUES (?, ?, CURRENT_TIMESTAMP)
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

  const user = await env.DB.prepare(
    `
      SELECT id, discord_user_id
      FROM users
      WHERE discord_user_id = ?
      LIMIT 1
    `
  )
    .bind(discordUser.id)
    .first();

  if (!user) {
    throw new Error(
      "Unable to create myJet2 user."
    );
  }

  let existingAccount = await env.DB.prepare(
    `
      SELECT
        id,
        user_id,
        username
      FROM myjet2_accounts
      WHERE user_id = ?
      LIMIT 1
    `
  )
    .bind(user.id)
    .first();

  if (signupUsername) {
    if (!MYJET2_USERNAME_PATTERN.test(signupUsername)) {
      return new Response(
        "Invalid myJet2 username.",
        { status: 400 }
      );
    }

    const usernameOwner = await env.DB.prepare(
      `
        SELECT
          id,
          user_id
        FROM myjet2_accounts
        WHERE username = ? COLLATE NOCASE
        LIMIT 1
      `
    )
      .bind(signupUsername)
      .first();

    if (usernameOwner && String(usernameOwner.user_id) !== String(user.id)) {
      return redirect(
        "/myjet2/register?error=username_taken",
        [
          [
            "Set-Cookie",
            clearCookie(MYJET2_OAUTH_STATE_COOKIE)
          ],
          [
            "Set-Cookie",
            clearCookie(MYJET2_SIGNUP_USERNAME_COOKIE)
          ]
        ]
      );
    }

    if (existingAccount?.username && existingAccount.username !== signupUsername) {
      return redirect(
        "/myjet2/register?error=already_registered",
        [
          [
            "Set-Cookie",
            clearCookie(MYJET2_OAUTH_STATE_COOKIE)
          ],
          [
            "Set-Cookie",
            clearCookie(MYJET2_SIGNUP_USERNAME_COOKIE)
          ]
        ]
      );
    }

    if (!existingAccount) {
      await ensureMyJet2Account(env, user.id, signupUsername);
    } else if (!existingAccount.username) {
      await env.DB.prepare(
        `
          UPDATE myjet2_accounts
          SET
            username = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `
      )
        .bind(signupUsername, existingAccount.id)
        .run();
    }
  } else {
    await ensureMyJet2Account(env, user.id);
  }

  const sessionId = randomToken(32);

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
        datetime('now', ?)
      )
    `
  )
    .bind(
      sessionId,
      user.id,
      `+${MYJET2_SESSION_HOURS} hours`
    )
    .run();

  return redirect(
    signupUsername
      ? "/myjet2/register?completed=1"
      : "/myjet2",
    [
      [
        "Set-Cookie",
        makeCookie(
          MYJET2_SESSION_COOKIE,
          sessionId
        )
      ],
      [
        "Set-Cookie",
        clearCookie(
          MYJET2_OAUTH_STATE_COOKIE
        )
      ],
      [
        "Set-Cookie",
        clearCookie(
          MYJET2_SIGNUP_USERNAME_COOKIE
        )
      ]
    ]
  );
}

async function handleMyJet2Me(env, request) {
  const identity = await getMyJet2Identity(
    env,
    request
  );

  if (!identity) {
    return json(
      { authenticated: false },
      401
    );
  }

  const account = await ensureMyJet2Account(
    env,
    identity.user.id
  );

  const tier = await refreshMyJet2Tier(
    env,
    account
  );

  const perks = await getMyJet2Perks(
    env,
    account.id
  );

  const transactions =
    await getMyJet2Transactions(
      env,
      account.id
    );

  return json({
    authenticated: true,
    user: {
      id: identity.user.discord_user_id,
      username: identity.user.discord_username,
      avatarUrl: getDiscordAvatarUrl({
        id: identity.user.discord_user_id,
        avatar: identity.member.user?.avatar
      })
    },
    account: serializeMyJet2Account(
      account,
      tier
    ),
    perks,
    transactions
  });
}

async function handleMyJet2Perks(env, request) {
  const identity = await getMyJet2Identity(
    env,
    request
  );

  if (!identity) {
    return json(
      { error: "myJet2 authentication required." },
      401
    );
  }

  const account = await ensureMyJet2Account(
    env,
    identity.user.id
  );

  return json({
    perks: await getMyJet2Perks(
      env,
      account.id
    )
  });
}

async function handleMyJet2Redeem(env, request) {
  const identity = await getMyJet2Identity(
    env,
    request
  );

  if (!identity) {
    return json(
      { error: "myJet2 authentication required." },
      401
    );
  }

  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed." },
      405,
      [["Allow", "POST"]]
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "Invalid request." },
      400
    );
  }

  const perkId = Number(body?.perkId);

  if (!Number.isInteger(perkId) || perkId <= 0) {
    return json(
      { error: "A valid perk is required." },
      400
    );
  }

  const account = await ensureMyJet2Account(
    env,
    identity.user.id
  );

  if (!account || account.status !== "active") {
    return json(
      { error: "Your myJet2 account is not active." },
      403
    );
  }

  const perk = await env.DB.prepare(
    `
      SELECT
        id,
        perk_key,
        name,
        description,
        points_cost,
        acquisition_type,
        redemption_type,
        active,
        metadata_json
      FROM myjet2_perks
      WHERE id = ?
      LIMIT 1
    `
  )
    .bind(perkId)
    .first();

  if (!perk || !perk.active) {
    return json(
      { error: "That perk is not available." },
      404
    );
  }

  if (!["purchase", "both"].includes(perk.acquisition_type)) {
    return json(
      { error: "That perk is granted automatically and cannot be purchased." },
      400
    );
  }

  const existing = await env.DB.prepare(
    `
      SELECT id
      FROM myjet2_account_perks
      WHERE account_id = ?
        AND perk_id = ?
        AND status IN ('unlocked', 'active')
        AND (
          expires_at IS NULL
          OR expires_at > CURRENT_TIMESTAMP
        )
      LIMIT 1
    `
  )
    .bind(account.id, perk.id)
    .first();

  if (existing && perk.redemption_type === "permanent") {
    return json(
      { error: "You already own this permanent perk." },
      409
    );
  }

  const cost = Number(perk.points_cost || 0);

  if (!Number.isInteger(cost) || cost < 0) {
    return json(
      { error: "This perk has an invalid points cost." },
      500
    );
  }

  const oldBalance = Number(account.points_balance || 0);
  const newBalance = oldBalance - cost;

  if (newBalance < 0) {
    return json(
      {
        error: "You do not have enough myJet2 points for this perk.",
        pointsBalance: oldBalance,
        pointsRequired: cost
      },
      400
    );
  }

  const redemptionId = randomToken(16);
  const referenceId = redemptionId;

  const statements = [
    env.DB.prepare(
      `
        UPDATE myjet2_accounts
        SET
          points_balance = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND points_balance = ?
          AND status = 'active'
      `
    ).bind(
      newBalance,
      account.id,
      oldBalance
    ),
    env.DB.prepare(
      `
        INSERT INTO myjet2_points_transactions (
          account_id,
          amount,
          transaction_type,
          source,
          description,
          reference_type,
          reference_id,
          balance_after
        )
        SELECT ?, ?, 'redeemed', 'myjet2', ?, 'redemption', ? , ?
        WHERE changes() > 0
      `
    ).bind(
      account.id,
      -cost,
      `Redeemed ${perk.name}`,
      referenceId,
      newBalance
    ),
    env.DB.prepare(
      `
        INSERT INTO myjet2_redemptions (
          account_id,
          perk_id,
          points_spent,
          status,
          reference_type,
          reference_id,
          metadata_json,
          completed_at
        )
        SELECT ?, ?, ?, 'completed', 'myjet2', ?, ?, CURRENT_TIMESTAMP
        WHERE changes() > 0
      `
    ).bind(
      account.id,
      perk.id,
      cost,
      referenceId,
      JSON.stringify({
        redemptionToken: redemptionId
      })
    )
  ];

  try {
    const results = await env.DB.batch(statements);
    const accountUpdate = results?.[0];
    const transactionInsert = results?.[1];
    const redemptionInsert = results?.[2];

    if (
      !accountUpdate?.meta?.changes ||
      !transactionInsert?.meta?.changes ||
      !redemptionInsert?.meta?.changes
    ) {
      return json(
        {
          error: "Your points balance changed. Please try the redemption again."
        },
        409
      );
    }
  } catch (error) {
    console.error("myJet2 redemption failed:", error);
    return json(
      { error: "Unable to complete the redemption." },
      500
    );
  }

  const redemption = await env.DB.prepare(
    `
      SELECT id
      FROM myjet2_redemptions
      WHERE account_id = ?
        AND reference_id = ?
      ORDER BY id DESC
      LIMIT 1
    `
  )
    .bind(account.id, referenceId)
    .first();

  const accountPerk = await env.DB.prepare(
    `
      INSERT INTO myjet2_account_perks (
        account_id,
        perk_id,
        status,
        granted_source,
        source_redemption_id,
        granted_at,
        metadata_json
      )
      VALUES (?, ?, 'active', 'redemption', ?, CURRENT_TIMESTAMP, ?)
    `
  )
    .bind(
      account.id,
      perk.id,
      redemption?.id || null,
      perk.metadata_json || null
    )
    .run();

  if (perk.redemption_type === "one_time") {
    if (perk.perk_key === "priority_pass") {
      await env.DB.prepare(
        `
          INSERT INTO myjet2_priority_passes (
            account_id,
            pass_type,
            status,
            source_redemption_id,
            metadata_json
          )
          VALUES (?, 'one_time', 'active', ?, ?)
        `
      )
        .bind(
          account.id,
          redemption?.id || null,
          perk.metadata_json || null
        )
        .run();
    }
  } else if (perk.perk_key === "priority_pass") {
    await env.DB.prepare(
      `
        INSERT INTO myjet2_priority_passes (
          account_id,
          pass_type,
          status,
          source_redemption_id,
          metadata_json
        )
        VALUES (?, 'permanent', 'active', ?, ?)
      `
    )
      .bind(
        account.id,
        redemption?.id || null,
        perk.metadata_json || null
      )
      .run();
  }

  const refreshedAccount = await ensureMyJet2Account(
    env,
    identity.user.id
  );
  const tier = await refreshMyJet2Tier(
    env,
    refreshedAccount
  );

  return json({
    success: true,
    redemptionId: redemption?.id || null,
    accountPerkId: accountPerk.meta?.last_row_id || null,
    account: serializeMyJet2Account(
      refreshedAccount,
      tier
    )
  });
}

async function handleMyJet2AdminPoints(env, request) {
  const owner = await requireOwnerSession(
    env,
    request
  );

  if (!owner) {
    return json(
      { error: "Owner authentication required." },
      401
    );
  }

  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed." },
      405,
      [["Allow", "POST"]]
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "Invalid request." },
      400
    );
  }

  const discordUserId =
    typeof body?.discordUserId === "string"
      ? body.discordUserId.trim()
      : "";
  const amount = Number(body?.amount);
  const source =
    typeof body?.source === "string" && body.source.trim()
      ? body.source.trim()
      : "admin";
  const description =
    typeof body?.description === "string"
      ? body.description.trim()
      : "";

  if (!isValidDiscordUserId(discordUserId)) {
    return json(
      { error: "Enter a valid Discord user ID." },
      400
    );
  }

  if (!Number.isInteger(amount) || amount === 0) {
    return json(
      { error: "Amount must be a non-zero whole number." },
      400
    );
  }

  await env.DB.prepare(
    `
      INSERT INTO users (
        discord_user_id,
        discord_username,
        updated_at
      )
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(discord_user_id)
      DO UPDATE SET updated_at = CURRENT_TIMESTAMP
    `
  )
    .bind(discordUserId, discordUserId)
    .run();

  const user = await env.DB.prepare(
    `
      SELECT id
      FROM users
      WHERE discord_user_id = ?
      LIMIT 1
    `
  )
    .bind(discordUserId)
    .first();

  if (!user) {
    return json(
      { error: "Unable to find the passenger account." },
      500
    );
  }

  const account = await ensureMyJet2Account(
    env,
    user.id
  );
  const oldBalance = Number(account.points_balance || 0);
  const newBalance = oldBalance + amount;

  if (newBalance < 0) {
    return json(
      { error: "This adjustment would make the balance negative." },
      400
    );
  }

  const transactionType = amount > 0
    ? "adjustment"
    : "penalty";

  try {
    const adminResults = await env.DB.batch([
      env.DB.prepare(
        `
          UPDATE myjet2_accounts
          SET
            points_balance = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
            AND points_balance = ?
        `
      ).bind(
        newBalance,
        account.id,
        oldBalance
      ),
      env.DB.prepare(
        `
          INSERT INTO myjet2_points_transactions (
            account_id,
            amount,
            transaction_type,
            source,
            description,
            reference_type,
            reference_id,
            balance_after,
            created_by_user_id
          )
          SELECT ?, ?, ?, ?, ?, 'admin_adjustment', ?, ?, ?
          WHERE changes() > 0
        `
      ).bind(
        account.id,
        amount,
        transactionType,
        source,
        description || null,
        owner.user.id,
        newBalance,
        owner.user.id
      )
    ]);

    if (
      !adminResults?.[0]?.meta?.changes ||
      !adminResults?.[1]?.meta?.changes
    ) {
      return json(
        { error: "The points balance changed. Please try again." },
        409
      );
    }
  } catch (error) {
    console.error("myJet2 admin points adjustment failed:", error);
    return json(
      { error: "Unable to update the points balance." },
      500
    );
  }

  const refreshed = await ensureMyJet2Account(
    env,
    user.id
  );
  const tier = await refreshMyJet2Tier(
    env,
    refreshed
  );

  await env.DB.prepare(
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
      owner.user.id,
      "myjet2.points.adjust",
      "myjet2_account",
      String(account.id),
      JSON.stringify({
        discordUserId,
        amount,
        source,
        description: description || null
      })
    )
    .run();

  return json({
    success: true,
    account: serializeMyJet2Account(
      refreshed,
      tier
    )
  });
}

async function handleMyJet2Logout(env, request) {
  const sessionId = getMyJet2SessionId(request);

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

  return json(
    { authenticated: false },
    200,
    [
      [
        "Set-Cookie",
        clearCookie(MYJET2_SESSION_COOKIE)
      ]
    ]
  );
}


/* =========================================================
   PUBLIC ORGANIZATION DIRECTORY
   ========================================================= */

async function handlePublicOrganization(env, request) {
  if (request.method !== "GET") {
    return json(
      { error: "Method not allowed." },
      405,
      [["Allow", "GET"]]
    );
  }

  const url = new URL(request.url);
  const requestedGroup = url.searchParams.get("group");
  const requestedStatus =
    url.searchParams.get("status") || "current";

  const allowedGroups = new Set([
    "leadership",
    "bod",
    "directors"
  ]);

  const group =
    requestedGroup &&
    allowedGroups.has(requestedGroup)
      ? requestedGroup
      : "leadership";

  const status =
    requestedStatus === "past"
      ? "past"
      : "current";

  const rows = await env.DB.prepare(
    `
      SELECT
        id,
        discord_user_id,
        display_name,
        position_title,
        group_type,
        status,
        display_order,
        description,
        custom_photo_url
      FROM organization_people
      WHERE group_type = ?
        AND status = ?
      ORDER BY
        display_order ASC,
        id ASC
    `
  )
    .bind(group, status)
    .all();

  const people = [];

  for (const row of rows.results || []) {
    people.push({
      id: row.id,
      displayName: row.display_name,
      positionTitle: row.position_title,
      groupType: row.group_type,
      status: row.status,
      displayOrder: row.display_order,
      description: row.description || "",
      photoUrl:
        row.custom_photo_url ||
        await resolveOrganizationPhoto(
          env,
          row
        )
    });
  }

  return json({ people });
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
        url.pathname ===
          "/api/applications/types"
      ) {
        return await handleApplicationTypes(
          env
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/applications/start"
      ) {
        return await handleApplicationStart(
          env,
          request
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/discord/interactions"
      ) {
        return await handleApplicationInteraction(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/myjet2/auth/discord"
      ) {
        return await handleMyJet2Login(env, request);
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/myjet2/auth/discord/callback"
      ) {
        return await handleMyJet2Callback(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/myjet2/me"
      ) {
        return await handleMyJet2Me(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/myjet2/perks"
      ) {
        return await handleMyJet2Perks(
          env,
          request
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/myjet2/redeem"
      ) {
        return await handleMyJet2Redeem(
          env,
          request
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/myjet2/admin/points"
      ) {
        return await handleMyJet2AdminPoints(
          env,
          request
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/myjet2/auth/logout"
      ) {
        return await handleMyJet2Logout(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/public/organization"
      ) {
        return await handlePublicOrganization(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/owner/password-diagnostic"
      ) {
        return await handleOwnerPasswordDiagnostic(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/owner/password-verifier-diagnostic"
      ) {
        return await handleOwnerPasswordVerifierDiagnostic(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/owner/status"
      ) {
        return await handleOwnerStatus(
          env,
          request
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/owner/login"
      ) {
        return await handleOwnerLogin(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        url.pathname ===
          "/api/owner/me"
      ) {
        return await handleOwnerMe(
          env,
          request
        );
      }

      if (
        ["GET", "POST", "PUT", "DELETE"].includes(request.method) &&
        url.pathname ===
          "/api/owner/organization"
      ) {
        return await handleOwnerOrganization(
          env,
          request
        );
      }

      if (
        request.method === "POST" &&
        url.pathname ===
          "/api/owner/logout"
      ) {
        return await handleOwnerLogout(
          env,
          request
        );
      }

      if (
        request.method === "GET" &&
        (
          url.pathname === "/apply" ||
          url.pathname.startsWith("/apply/")
        )
      ) {
        const indexRequest = new Request(
          new URL("/index.html", request.url),
          { method: "GET", headers: request.headers }
        );
        return env.ASSETS.fetch(indexRequest);
      }

      if (
        request.method === "GET" &&
        (
          url.pathname === "/myjet2" ||
          url.pathname.startsWith("/myjet2/")
        )
      ) {
        const indexRequest = new Request(
          new URL("/index.html", request.url),
          {
            method: "GET",
            headers: request.headers
          }
        );

        return env.ASSETS.fetch(indexRequest);
      }

      if (
        request.method === "GET" &&
        (
          url.pathname === "/leadership" ||
          url.pathname.startsWith("/leadership/")
        )
      ) {
        const indexRequest = new Request(
          new URL("/index.html", request.url),
          {
            method: "GET",
            headers: request.headers
          }
        );

        return env.ASSETS.fetch(indexRequest);
      }

      if (
        request.method === "GET" &&
        (
          url.pathname === "/staff/owner" ||
          url.pathname.startsWith("/staff/owner/")
        )
      ) {
        return await handleOwnerPage(
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
