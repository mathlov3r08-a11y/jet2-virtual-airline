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
