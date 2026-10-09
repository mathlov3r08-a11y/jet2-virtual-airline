import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { useEffect, useState } from "react";

/* =========================================================
   AUTHENTICATION
   ========================================================= */

async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (!data.authenticated) {
    return null;
  }

  return data;
}

/* =========================================================
   DISPLAY HELPERS
   ========================================================= */

function getRankTitle(rank) {
  const titleMap = {
    CHM: "Chairman",
    "EV-CHM": "Executive Vice Chairman",
    VCHM: "Vice Chairman",
    CEO: "Chief Executive Officer",
    COO: "Chief Operating Officer",

    CDO: "Chief Data Officer",
    CTO: "Chief Technology Officer",
    CHRO: "Chief Human Resources Officer",
    CAO: "Chief Administrative Officer",
    CMO: "Chief Management Officer",
    COM: "Chief Of Marketing",
    CXO: "Chief Experience Officer",

    GM: "General Manager",
    C: "Coordinator",
    A: "Associate",
    MI: "Management Intern",

    HRM: "Human Resources Manager",
    SHRO: "Senior Human Resources Officer",
    HRO: "Human Resources Officer",
    HRT: "Human Resources Trainee",

    PRM: "Public Relations Manager",
    SPRC: "Senior Public Relations Coordinator",
    PRC: "Public Relations Coordinator",
    PRI: "Public Relations Intern",

    BM: "Brand Manager",
    SMS: "Senior Marketing Specialist",
    MS: "Marketing Specialist",
    MI: "Management Intern",

    SOM: "Senior Operations Manager",
    FOM: "Flight Operations Manager",
    FOI: "Flight Operations Intern"
  };

  const rawTitle =
    rank?.title ||
    rank?.name ||
    "Staff";

  return (
    titleMap[rawTitle] ||
    rawTitle
  );
}

function getOrganizationalUnit(
  rank,
  positions
) {
  if (
    positions &&
    positions.length > 0
  ) {
    return positions
      .map(
        (position) =>
          position.department
      )
      .filter(Boolean)
      .filter(
        (department, index, array) =>
          array.indexOf(department) ===
          index
      )
      .slice(0, 2);
  }

  const rawRank =
    rank?.title ||
    rank?.name ||
    "";

  if (
    [
      "CHM",
      "EV-CHM",
      "VCHM",
      "CEO",
      "COO"
    ].includes(rawRank)
  ) {
    return ["Leadership"];
  }

  if (
    [
      "CDO",
      "CTO",
      "CHRO",
      "CAO",
      "CMO",
      "COM",
      "CXO"
    ].includes(rawRank)
  ) {
    return ["Board of Directors"];
  }

  return [];
}

/* =========================================================
   MODULE ACCESS
   ========================================================= */

function getAvailableModules(
  permissions = {}
) {
  const permissionSet = new Set(
    Array.isArray(permissions)
      ? permissions
      : []
  );

  const hasPermission = (name) =>
    permissionSet.has(name) ||
    Boolean(
      permissions?.[name?.split(".")?.[0]]?.[name?.split(".")?.[1]]
    );
  const modules = [];

  if (hasPermission("portal.view") || permissions.portal === true) {
    modules.push({
      label: "Dashboard",
      path: "/staff"
    });
  }

  if (
    hasPermission("flights.view") ||
    hasPermission("flights.create") ||
    hasPermission("flights.edit") ||
    hasPermission("flights.manage")
  ) {
    modules.push({
      label: "Flight Operations",
      path: "/staff/flights"
    });
  }

  if (hasPermission("staff.view") || hasPermission("staff.manage")) {
    modules.push({
      label: "Staff Management",
      path: "/staff/staff"
    });
  }

  if (hasPermission("training.view") || hasPermission("training.manage")) {
    modules.push({
      label: "Training",
      path: "/staff/training"
    });
  }

  if (hasPermission("careers.view") || hasPermission("careers.manage")) {
    modules.push({
      label: "Careers",
      path: "/staff"
    });
  }

  if (hasPermission("announcements.view") || hasPermission("announcements.manage")) {
    modules.push({
      label: "Announcements",
      path: "/staff"
    });
  }

  if (hasPermission("admin.review") || hasPermission("admin.owner")) {
    modules.push({
      label: "Administration",
      path: "/staff"
    });
  }

  return modules;
}

/* =========================================================
   COLLAPSIBLE SIDEBAR SECTION
   ========================================================= */

function SidebarSection({
  title,
  children,
  defaultOpen = false
}) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <div className="sidebar-section">
      <button
        type="button"
        className="sidebar-section-toggle"
        onClick={() =>
          setOpen((value) => !value)
        }
        aria-expanded={open}
      >
        <span>
          {title}
        </span>

        <span
          className={
            open
              ? "sidebar-chevron open"
              : "sidebar-chevron"
          }
        >
          â€º
        </span>
      </button>

      {open && (
        <div className="sidebar-section-content">
          {children}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   LOGOUT
   ========================================================= */

async function handleLogout() {
  try {
    await fetch(
      "/api/auth/logout",
      {
        method: "POST",
        credentials: "include"
      }
    );
  } catch (error) {
    console.error(
      "Logout request failed:",
      error
    );
  } finally {
    window.location.href = "/apply";
  }
}

/* =========================================================
   STAFF LAYOUT
   ========================================================= */

function StaffLayout({
  children,
  authData
}) {
  const location = useLocation();

  const user = authData?.user;
  const rank = authData?.rank;
  const positions =
    authData?.positions || [];

  const permissions =
    authData?.permissions || [];

  const navigation = [
    {
      label: "Dashboard",
      path: "/staff"
    },
    {
      label: "Flights",
      path: "/staff/flights"
    },
    {
      label: "Staff",
      path: "/staff/staff"
    },
    {
      label: "Training",
      path: "/staff/training"
    }
  ];

  if (
    Array.isArray(permissions) &&
    permissions.includes("admin.owner")
  ) {
    navigation.push({
      label: "Administration",
      path: "/staff/owner"
    });
  }

  const rankTitle =
    getRankTitle(rank);

  const departments =
    getOrganizationalUnit(
      rank,
      positions
    );

  const availableModules =
    getAvailableModules(
      permissions
    );

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <div className="staff-brand">
          <div className="brand-mark">
            J2
          </div>

          <div>
            <strong>
              Jet2 | PTFS
            </strong>

            <span>
              Staff Portal
            </span>
          </div>
        </div>

        <nav className="staff-navigation">
          <span className="nav-heading">
            OPERATIONS
          </span>

          {navigation.map(
            (item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname ===
                  item.path
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          {user ? (
            <>
              <div className="staff-user">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="staff-avatar"
                  />
                ) : (
                  <div className="staff-avatar-placeholder">
                    {user.username
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "?"}
                  </div>
                )}

                <div className="staff-user-info">
                  <strong>
                    {user.username}
                  </strong>

                  <span className="staff-user-meta">
                    {rankTitle}
                  </span>

                  {departments.length >
                    0 && (
                    <span className="staff-user-department">
                      {departments.join(
                        " Â· "
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="sidebar-details">
                <SidebarSection
                  title="Modules Available"
                >
                  {availableModules.length >
                  0 ? (
                    <div className="module-list">
                      {availableModules.map(
                        (module) => (
                          <Link
                            key={
                              module.label
                            }
                            to={
                              module.path
                            }
                            className="module-item"
                          >
                            <span className="module-check">
                              âœ“
                            </span>

                            <span>
                              {
                                module.label
                              }
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="sidebar-empty">
                      No modules available.
                    </span>
                  )}
                </SidebarSection>

                <SidebarSection
                  title="Departments"
                >
                  {departments.length >
                  0 ? (
                    <div className="sidebar-value-list">
                      {departments.map(
                        (department) => (
                          <span
                            key={
                              department
                            }
                            className="sidebar-value"
                          >
                            {
                              department
                            }
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <span className="sidebar-empty">
                      No department assignments.
                    </span>
                  )}
                </SidebarSection>

                <SidebarSection
                  title="Rank Information"
                >
                  <div className="rank-info">
                    <div>
                      <span>
                        Rank
                      </span>

                      <strong>
                        {rankTitle}
                      </strong>
                    </div>

                    {rank?.level && (
                      <div>
                        <span>
                          Hierarchy Level
                        </span>

                        <strong>
                          {rank.level}
                        </strong>
                      </div>
                    )}
                  </div>
                </SidebarSection>

                <SidebarSection
                  title="Account & Security"
                >
                  <div className="security-info">
                    <div>
                      <span>
                        Discord Account
                      </span>

                      <strong className="security-good">
                        Connected
                      </strong>
                    </div>

                    <div>
                      <span>
                        Staff Session
                      </span>

                      <strong className="security-good">
                        Active
                      </strong>
                    </div>
                  </div>
                </SidebarSection>
              </div>

              <button
                type="button"
                className="logout-button"
                onClick={
                  handleLogout
                }
              >
                <span>
                  â†ª
                </span>

                Log Out
              </button>
            </>
          ) : (
            <>
              <span>
                Staff access
              </span>

              <small>
                Discord verification required
              </small>
            </>
          )}
        </div>
      </aside>

      <div className="staff-content">
        <header className="staff-header">
          <div>
            <span className="header-kicker">
              JET2 | PTFS
            </span>

            <h1>
              Staff Portal
            </h1>
          </div>

          <div className="header-status">
            <span className="status-dot"></span>
            System online
          </div>
        </header>

        <div className="staff-page">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PUBLIC HOME
   ========================================================= */

function Home() {
  return (
    <main className="public-page">
      <div className="public-card">
        <span className="header-kicker">
          JET2 | PTFS
        </span>

        <h1>
          Welcome aboard.
        </h1>

        <p>
          The public Jet2 | PTFS website is
          being built.
        </p>

        <Link
          className="primary-button"
          to="/staff"
        >
          Staff Login
        </Link>
      </div>
    </main>
  );
}

/* =========================================================
   STAFF DASHBOARD
   ========================================================= */

function StaffDashboard({
  authData
}) {
  const user = authData?.user;
  const rank = authData?.rank;
  const positions =
    authData?.positions || [];

  const departmentNames =
    getOrganizationalUnit(
      rank,
      positions
    );

  const rankTitle =
    getRankTitle(rank);

  return (
    <div>
      <section className="welcome-section">
        <div>
          <span className="section-label">
            STAFF DASHBOARD
          </span>

          <h2>
            Hello{" "}
            {user?.username ||
              "Staff Member"}!
          </h2>

          <p>
            Welcome to the Jet2 | PTFS Staff
            Portal. Manage flights, staff,
            training and airline operations
            from one place.
          </p>
        </div>

        <div className="dashboard-badge">
          <span className="status-dot"></span>
          Operations ready
        </div>
      </section>

      <section className="dashboard-grid">
        <Link
          to="/staff/flights"
          className="dashboard-card"
        >
          <span className="card-icon">
            âœˆ
          </span>

          <div>
            <h3>
              Flight Operations
            </h3>

            <p>
              Create and manage flights,
              hosts, schedules and boarding.
            </p>
          </div>

          <span className="card-arrow">
            â†’
          </span>
        </Link>

        <Link
          to="/staff/staff"
          className="dashboard-card"
        >
          <span className="card-icon">
            â—‰
          </span>

          <div>
            <h3>
              Staff Management
            </h3>

            <p>
              Manage staff records, roles
              and operational access.
            </p>
          </div>

          <span className="card-arrow">
            â†’
          </span>
        </Link>

        <Link
          to="/staff/training"
          className="dashboard-card"
        >
          <span className="card-icon">
            âœ“
          </span>

          <div>
            <h3>
              Training
            </h3>

            <p>
              Track training programmes,
              progress and certifications.
            </p>
          </div>

          <span className="card-arrow">
            â†’
          </span>
        </Link>

        <div className="dashboard-card disabled-card">
          <span className="card-icon">
            â–£
          </span>

          <div>
            <h3>
              Applications
            </h3>

            <p>
              Review and manage staff
              applications.
            </p>
          </div>

          <span className="coming-soon">
            COMING SOON
          </span>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="section-label">
              YOUR ACCESS
            </span>

            <h3>
              Staff profile
            </h3>
          </div>
        </div>

        <div className="status-list">
          <div className="status-row">
            <span>
              Discord account
            </span>

            <strong className="online-text">
              {user?.username ||
                "Verified"}
            </strong>
          </div>

          <div className="status-row">
            <span>
              Rank
            </span>

            <strong className="online-text">
              {rankTitle}
            </strong>
          </div>

          <div className="status-row">
            <span>
              Department
            </span>

            <strong className="online-text">
              {departmentNames.length >
              0
                ? departmentNames.join(
                    " Â· "
                  )
                : "No department assignment"}
            </strong>
          </div>

          <div className="status-row">
            <span>
              Staff Portal
            </span>

            <strong className="online-text">
              Authorized
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   FLIGHTS
   ========================================================= */

function StaffFlights() {
  return (
    <div className="placeholder-page">
      <span className="section-label">
        FLIGHT OPERATIONS
      </span>

      <h2>
        Flight Management
      </h2>

      <p>
        Flight creation, hosts, aircraft,
        boarding and operational controls
        will live here.
      </p>
    </div>
  );
}

/* =========================================================
   STAFF MEMBERS
   ========================================================= */

function StaffMembers() {
  return (
    <div className="placeholder-page">
      <span className="section-label">
        STAFF
      </span>

      <h2>
        Staff Management
      </h2>

      <p>
        Staff records, roles and permissions
        will live here.
      </p>
    </div>
  );
}

/* =========================================================
   TRAINING
   ========================================================= */

function StaffTraining() {
  return (
    <div className="placeholder-page">
      <span className="section-label">
        TRAINING
      </span>

      <h2>
        Training
      </h2>

      <p>
        Training programmes, requirements
        and progress will live here.
      </p>
    </div>
  );
}

/* =========================================================
   OWNER CONTROL ROOM
   ========================================================= */

async function getOwnerStatus() {
  const response = await fetch("/api/owner/status", {
    method: "GET",
    credentials: "include"
  });
  let data = {};
  try { data = await response.json(); } catch { data = {}; }
  return { ok: response.ok, status: response.status, ...data };
}

async function loginOwner(password, totp) {
  const response = await fetch("/api/owner/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, totp })
  });
  let data = {};
  try { data = await response.json(); } catch { data = {}; }
  return { ok: response.ok, status: response.status, ...data };
}

async function getOwnerMe() {
  const response = await fetch("/api/owner/me", {
    method: "GET",
    credentials: "include"
  });
  let data = {};
  try { data = await response.json(); } catch { data = {}; }
  return { ok: response.ok, status: response.status, ...data };
}

async function logoutOwner() {
  try {
    await fetch("/api/owner/logout", {
      method: "POST",
      credentials: "include"
    });
  } catch (error) {
    console.error("Owner logout request failed:", error);
  }
  window.location.href = "/staff";
}

function OwnerLoginScreen({ onAuthenticated }) {
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const result = await loginOwner(password, totp);
      if (!result.ok) {
        setError(result.error || "Invalid owner credentials.");
        return;
      }
      setPassword("");
      setTotp("");
      onAuthenticated();
    } catch (error) {
      console.error("Owner login request failed:", error);
      setError("Unable to contact Owner Security. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="public-page">
      <div className="public-card" style={{ maxWidth: "560px", width: "100%" }}>
        <span className="header-kicker">JET2 | PTFS</span>
        <h1>Owner Control Room</h1>
        <p>This area requires a separate privileged security check. Your Discord identity has already been verified.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px", marginTop: "24px", textAlign: "left" }}>
          <label style={{ display: "grid", gap: "7px" }}>
            <span style={{ fontWeight: 700 }}>Owner Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your Owner password" disabled={submitting} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #d9d9d9", borderRadius: "10px", fontSize: "16px" }} />
          </label>
          <label style={{ display: "grid", gap: "7px" }}>
            <span style={{ fontWeight: 700 }}>Authenticator Code</span>
            <input type="text" inputMode="numeric" autoComplete="one-time-code" value={totp} onChange={(event) => setTotp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit code" maxLength={6} disabled={submitting} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #d9d9d9", borderRadius: "10px", fontSize: "18px", letterSpacing: "4px" }} />
          </label>
          {error && <div role="alert" style={{ padding: "12px 14px", borderRadius: "10px", background: "#fff1f1", border: "1px solid #f0b8b8", color: "#a40000", fontWeight: 600 }}>{error}</div>}
          <button type="submit" className="primary-button" disabled={submitting || !password || totp.length !== 6} style={{ border: "none", cursor: submitting || !password || totp.length !== 6 ? "not-allowed" : "pointer", opacity: submitting || !password || totp.length !== 6 ? 0.6 : 1 }}>
            {submitting ? "Verifying..." : "Enter Owner Control Room"}
          </button>
        </form>
        <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #eeeeee", fontSize: "13px", color: "#666666" }}>
          <strong>Security:</strong> Owner sessions expire after 30 minutes and are protected separately from your normal Staff Portal session.
        </div>
      </div>
    </main>
  );
}

function OwnerControlRoom({ ownerData, onLogout }) {
  const username = ownerData?.user?.username || "Owner";
  const rankTitle = getRankTitle(ownerData?.rank);
  return (
    <main className="public-page">
      <div className="public-card" style={{ maxWidth: "900px", width: "100%" }}>
        <span className="header-kicker">JET2 | PTFS</span>
        <h1>Owner Control Room</h1>
        <p>Welcome, {username}. Your privileged Owner session is active.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12, marginTop: 28 }}>
          <div style={{ padding: 18, border: "1px solid #e5e5e5", borderRadius: 14, background: "#fafafa" }}>
            <span className="section-label">SECURITY</span>
            <strong style={{ display: "block", marginTop: 6, fontSize: 18 }}>Protected</strong>
            <span style={{ color: "#777", fontSize: 13 }}>Password + TOTP</span>
          </div>
          <div style={{ padding: 18, border: "1px solid #e5e5e5", borderRadius: 14, background: "#fafafa" }}>
            <span className="section-label">IDENTITY</span>
            <strong style={{ display: "block", marginTop: 6, fontSize: 18 }}>{username}</strong>
            <span style={{ color: "#777", fontSize: 13 }}>{rankTitle}</span>
          </div>
          <div style={{ padding: 18, border: "1px solid #e5e5e5", borderRadius: 14, background: "#fafafa" }}>
            <span className="section-label">SESSION</span>
            <strong style={{ display: "block", marginTop: 6, fontSize: 18 }}>30 minutes</strong>
            <span style={{ color: "#777", fontSize: 13 }}>Privileged session</span>
          </div>
        </div>

        <div className="dashboard-grid" style={{ marginTop: 18 }}>
          <Link to="/staff/owner/organization" className="dashboard-card">
            <span className="card-icon">ðŸ¢</span>
            <div><h3>Organization</h3><p>Manage Leadership, Board of Directors and future Directors records.</p></div>
            <span className="card-arrow">â†’</span>
          </Link>
          <div className="dashboard-card">
            <span className="card-icon">ðŸ”</span>
            <div><h3>Owner Security</h3><p>Privileged access is protected by your password and authenticator code.</p></div>
          </div>
          <div className="dashboard-card">
            <span className="card-icon">ðŸ“‹</span>
            <div><h3>Audit & Security</h3><p>Administrative audit tools are reserved for the next control-room phase.</p></div>
            <span className="coming-soon">COMING SOON</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginTop: "28px" }}>
          <span className="dashboard-badge"><span className="status-dot"></span>Owner session active</span>
          <button type="button" className="primary-button" onClick={onLogout} style={{ border: "none", cursor: "pointer" }}>Exit Owner Control Room</button>
        </div>
      </div>
    </main>
  );
}

function OwnerPortal() {
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadOwnerStatus() {
      try {
        const status = await getOwnerStatus();
        if (cancelled) return;
        if (!status.eligible) { window.location.href = "/staff"; return; }
        setEligible(true);
        if (status.authenticated) {
          const ownerMe = await getOwnerMe();
          if (cancelled) return;
          if (ownerMe.ok && ownerMe.authenticated) { setOwnerData(ownerMe); setAuthenticated(true); }
        }
      } catch (error) {
        console.error("Unable to load Owner Security status:", error);
        if (!cancelled) window.location.href = "/staff";
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadOwnerStatus();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <main className="public-page"><div className="public-card"><span className="header-kicker">JET2 | PTFS</span><h1>Checking Owner Security...</h1><p>Verifying your Discord identity and Owner access.</p><div className="dashboard-badge"><span className="status-dot"></span>Authenticating</div></div></main>;
  if (!eligible) return null;
  if (!authenticated) {
    return <OwnerLoginScreen onAuthenticated={async () => {
      try {
        const ownerMe = await getOwnerMe();
        if (ownerMe.ok && ownerMe.authenticated) { setOwnerData(ownerMe); setAuthenticated(true); }
        else setAuthenticated(false);
      } catch (error) { console.error("Unable to load Owner session:", error); }
    }} />;
  }
  return (
    <Routes>
      <Route index element={<OwnerControlRoom ownerData={ownerData} onLogout={logoutOwner} />} />
      <Route path="organization" element={<OwnerOrganization />} />
    </Routes>
  );
}

/* =========================================================
   OWNER ORGANIZATION
   ========================================================= */

function OwnerLogin({ onAuthenticated }) {
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/owner/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password, totp })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Owner authentication failed.");
        return;
      }

      onAuthenticated();
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to contact the owner security service.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={ownerPageStyle}>
      <div style={ownerCardStyle}>
        <span className="section-label">OWNER SECURITY</span>
        <h2 style={{ marginBottom: 8 }}>Administration access</h2>
        <p style={{ color: "#666", lineHeight: 1.6 }}>
          Confirm the owner password and current authenticator code to manage Jet2 | PTFS organization records.
        </p>

        <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 24 }}>
          <label style={formLabelStyle}>
            Owner password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              style={formInputStyle}
            />
          </label>

          <label style={formLabelStyle}>
            Authenticator code
            <input
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={totp}
              onChange={(event) => setTotp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              autoComplete="one-time-code"
              required
              style={formInputStyle}
            />
          </label>

          {error && (
            <div style={errorStyle}>{error}</div>
          )}

          <button type="submit" disabled={busy} style={primaryButtonStyle}>
            {busy ? "Verifyingâ€¦" : "Enter Administration"}
          </button>
        </form>
      </div>
    </div>
  );
}

const ownerPageStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  paddingBottom: 48
};

const ownerCardStyle = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 18,
  padding: 28,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
};

const formLabelStyle = {
  display: "grid",
  gap: 7,
  fontWeight: 700,
  fontSize: 14,
  color: "#333"
};

const formInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d8d8d8",
  borderRadius: 10,
  padding: "11px 12px",
  font: "inherit",
  background: "#fff"
};

const primaryButtonStyle = {
  border: 0,
  borderRadius: 10,
  padding: "12px 16px",
  background: "#d71920",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer"
};

const secondaryButtonStyle = {
  border: "1px solid #d7d7d7",
  borderRadius: 10,
  padding: "10px 14px",
  background: "#fff",
  color: "#222",
  fontWeight: 700,
  cursor: "pointer"
};

const dangerButtonStyle = {
  ...secondaryButtonStyle,
  color: "#b20f16",
  borderColor: "#efb5b8"
};

const errorStyle = {
  background: "#fff1f1",
  border: "1px solid #f0c4c6",
  color: "#a10d13",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14
};

function OrganizationPersonForm({ initialPerson, onCancel, onSaved }) {
  const [form, setForm] = useState(() => ({
    id: initialPerson?.id || null,
    discordUserId: initialPerson?.discordUserId || "",
    displayName: initialPerson?.displayName || "",
    positionTitle: initialPerson?.positionTitle || "",
    groupType: initialPerson?.groupType || "leadership",
    status: initialPerson?.status || "current",
    displayOrder: initialPerson?.displayOrder ?? 0,
    description: initialPerson?.description || "",
    customPhotoUrl: initialPerson?.customPhotoUrl || ""
  }));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const method = form.id ? "PUT" : "POST";
      const response = await fetch("/api/owner/organization", {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Unable to save this person.");
        return;
      }

      onSaved();
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to contact the organization service.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 22, padding: 20, borderRadius: 14, background: "#f8f8f8", border: "1px solid #e6e6e6" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
        <div>
          <span className="section-label">{form.id ? "EDIT PERSON" : "ADD PERSON"}</span>
          <h3 style={{ margin: "5px 0 0" }}>{form.id ? "Update organization record" : "Create organization record"}</h3>
        </div>
        <button type="button" onClick={onCancel} style={secondaryButtonStyle}>Cancel</button>
      </div>

      <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          <label style={formLabelStyle}>
            Discord user ID
            <input value={form.discordUserId} onChange={(event) => update("discordUserId", event.target.value)} required style={formInputStyle} placeholder="Discord user ID" />
          </label>
          <label style={formLabelStyle}>
            Display name
            <input value={form.displayName} onChange={(event) => update("displayName", event.target.value)} required style={formInputStyle} placeholder="Name shown on the site" />
          </label>
          <label style={formLabelStyle}>
            Position title
            <input value={form.positionTitle} onChange={(event) => update("positionTitle", event.target.value)} required style={formInputStyle} placeholder="Chief Executive Officer" />
          </label>
          <label style={formLabelStyle}>
            Group
            <select value={form.groupType} onChange={(event) => update("groupType", event.target.value)} style={formInputStyle}>
              <option value="leadership">Leadership</option>
              <option value="bod">Board of Directors</option>
              <option value="directors">Directors</option>
            </select>
          </label>
          <label style={formLabelStyle}>
            Status
            <select value={form.status} onChange={(event) => update("status", event.target.value)} style={formInputStyle}>
              <option value="current">Current</option>
              <option value="past">Past</option>
            </select>
          </label>
          <label style={formLabelStyle}>
            Display order
            <input type="number" min="0" value={form.displayOrder} onChange={(event) => update("displayOrder", event.target.value)} style={formInputStyle} />
          </label>
        </div>

        <label style={formLabelStyle}>
          Description
          <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={3} style={{ ...formInputStyle, resize: "vertical" }} placeholder="Optional short description" />
        </label>

        <label style={formLabelStyle}>
          Custom photo URL <span style={{ fontWeight: 500, color: "#777" }}>(optional â€” Discord avatar is used by default)</span>
          <input type="url" value={form.customPhotoUrl} onChange={(event) => update("customPhotoUrl", event.target.value)} style={formInputStyle} placeholder="https://â€¦" />
        </label>

        {error && <div style={errorStyle}>{error}</div>}

        <button type="submit" disabled={busy} style={{ ...primaryButtonStyle, width: "fit-content" }}>
          {busy ? "Savingâ€¦" : form.id ? "Save Changes" : "Add Person"}
        </button>
      </form>
    </div>
  );
}

function OrganizationCard({ person, onEdit, onArchive, onRestore }) {
  return (
    <article style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1fr) auto", gap: 15, alignItems: "center", padding: 16, border: "1px solid #e5e5e5", borderRadius: 14, background: "#fff" }}>
      {person.photoUrl ? (
        <img src={person.photoUrl} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: 56, height: 56, borderRadius: "50%", display: "grid", placeItems: "center", background: "#eee", fontWeight: 800, color: "#666" }}>
          {person.displayName?.charAt(0)?.toUpperCase() || "?"}
        </div>
      )}

      <div style={{ minWidth: 0 }}>
        <strong style={{ display: "block", fontSize: 17 }}>{person.displayName}</strong>
        <span style={{ display: "block", marginTop: 3, color: "#555", fontWeight: 700 }}>{person.positionTitle}</span>
        {person.description && <p style={{ margin: "7px 0 0", color: "#777", lineHeight: 1.5 }}>{person.description}</p>}
        <small style={{ display: "block", marginTop: 7, color: "#999" }}>Discord ID: {person.discordUserId}</small>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <button type="button" onClick={() => onEdit(person)} style={secondaryButtonStyle}>Edit</button>
        {person.status === "current" ? (
          <button type="button" onClick={() => onArchive(person)} style={dangerButtonStyle}>Move to Past</button>
        ) : (
          <button type="button" onClick={() => onRestore(person)} style={secondaryButtonStyle}>Restore</button>
        )}
      </div>
    </article>
  );
}

function OwnerOrganization() {
  const [ownerAuthenticated, setOwnerAuthenticated] = useState(false);
  const [checkingOwner, setCheckingOwner] = useState(true);
  const [people, setPeople] = useState([]);
  const [tab, setTab] = useState("current");
  const [editing, setEditing] = useState(null);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [error, setError] = useState("");

  async function checkOwner() {
    setCheckingOwner(true);
    try {
      const response = await fetch("/api/owner/me", {
        credentials: "include"
      });
      setOwnerAuthenticated(response.ok);
    } catch (requestError) {
      console.error(requestError);
      setOwnerAuthenticated(false);
    } finally {
      setCheckingOwner(false);
    }
  }

  async function loadPeople() {
    setLoadingPeople(true);
    setError("");
    try {
      const response = await fetch("/api/owner/organization", {
        credentials: "include"
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setOwnerAuthenticated(false);
        }
        setError(data.error || "Unable to load organization records.");
        return;
      }

      setPeople(data.people || []);
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to contact the organization service.");
    } finally {
      setLoadingPeople(false);
    }
  }

  useEffect(() => {
    checkOwner();
  }, []);

  useEffect(() => {
    if (ownerAuthenticated) {
      loadPeople();
    }
  }, [ownerAuthenticated]);

  async function archivePerson(person) {
    if (!window.confirm(`Move ${person.displayName} to Past?`)) return;
    const response = await fetch("/api/owner/organization", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: person.id })
    });
    if (response.ok) {
      setEditing(null);
      loadPeople();
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Unable to archive this person.");
    }
  }

  async function restorePerson(person) {
    const response = await fetch("/api/owner/organization", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...person,
        customPhotoUrl: person.customPhotoUrl || "",
        status: "current"
      })
    });
    if (response.ok) {
      loadPeople();
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Unable to restore this person.");
    }
  }

  if (checkingOwner) {
    return <div style={ownerCardStyle}>Checking owner securityâ€¦</div>;
  }

  if (!ownerAuthenticated) {
    return <OwnerLogin onAuthenticated={() => setOwnerAuthenticated(true)} />;
  }

  const visiblePeople = people.filter((person) => person.status === tab);
  const groups = [
    { key: "leadership", title: "Leadership" },
    { key: "bod", title: "Board of Directors" },
    { key: "directors", title: "Directors" }
  ];

  return (
    <div style={ownerPageStyle}>
      <section style={{ marginBottom: 22 }}>
        <span className="section-label">ADMINISTRATION / ORGANIZATION</span>
        <h2 style={{ margin: "6px 0 8px" }}>Organization</h2>
        <p style={{ margin: 0, color: "#666", lineHeight: 1.6 }}>
          Manage the people displayed in the Jet2 | PTFS organizational structure. Discord avatars are automatic unless a custom image is supplied.
        </p>
      </section>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button type="button" onClick={() => setTab("current")} style={tab === "current" ? primaryButtonStyle : secondaryButtonStyle}>Current</button>
        <button type="button" onClick={() => setTab("past")} style={tab === "past" ? primaryButtonStyle : secondaryButtonStyle}>Past</button>
      </div>

      <section style={ownerCardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <span className="section-label">{tab.toUpperCase()} ORGANIZATION</span>
            <h3 style={{ margin: "5px 0 0" }}>{tab === "current" ? "Current team" : "Former team"}</h3>
          </div>
          <button type="button" onClick={() => setEditing({})} style={primaryButtonStyle}>+ Add Person</button>
        </div>

        {editing && (
          <OrganizationPersonForm
            initialPerson={editing.id ? editing : null}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              loadPeople();
            }}
          />
        )}

        {error && <div style={{ ...errorStyle, marginTop: 18 }}>{error}</div>}

        {loadingPeople ? (
          <p style={{ color: "#777", marginTop: 24 }}>Loading organization recordsâ€¦</p>
        ) : (
          <div style={{ display: "grid", gap: 24, marginTop: 24 }}>
            {groups.map((group) => {
              const groupPeople = visiblePeople.filter((person) => person.groupType === group.key);
              return (
                <section key={group.key}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <h4 style={{ margin: 0, fontSize: 18 }}>{group.title}</h4>
                    {group.key === "directors" && (
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#888", letterSpacing: ".06em" }}>COMING SOON</span>
                    )}
                  </div>

                  {groupPeople.length > 0 ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      {groupPeople.map((person) => (
                        <OrganizationCard
                          key={person.id}
                          person={person}
                          onEdit={setEditing}
                          onArchive={archivePerson}
                          onRestore={restorePerson}
                        />
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: 16, borderRadius: 12, background: "#f8f8f8", color: "#888" }}>
                      {group.key === "directors" ? "Director positions will appear here when introduced." : `No ${tab} ${group.title.toLowerCase()} records yet.`}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   AUTHENTICATED STAFF PORTAL
   ========================================================= */


/* =========================================================
   PUBLIC EXECUTIVE STAFF
   ========================================================= */

function ExecutiveStaffPage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadExecutiveStaff() {
      try {
        const response = await fetch(
          "/api/public/organization?group=leadership&status=current",
          {
            method: "GET",
            credentials: "omit"
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load Executive Staff."
          );
        }

        if (!cancelled) {
          setPeople(
            Array.isArray(data.people)
              ? data.people
              : []
          );
          setError("");
        }
      } catch (requestError) {
        console.error(
          "Unable to load Executive Staff:",
          requestError
        );

        if (!cancelled) {
          setError(
            "We couldn't load the Executive Staff directory right now."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExecutiveStaff();

    return () => {
      cancelled = true;
    };
  }, []);

  const orderedPeople = [...people].sort(
    (a, b) =>
      Number(a.displayOrder || 0) -
      Number(b.displayOrder || 0) ||
      Number(a.id || 0) -
      Number(b.id || 0)
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f5f6",
        color: "#171b21",
        fontFamily:
          "Arial, Helvetica, sans-serif"
      }}
    >
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(115deg, #520008 0%, #7d000d 45%, #3d0006 100%)",
          color: "#fff",
          padding: "72px 24px 64px"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-100px",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,.08), transparent 68%)"
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1180,
            margin: "0 auto"
          }}
        >
          <div
            style={{
              width: 58,
              height: 5,
              background: "#ef233c",
              borderRadius: 999,
              marginBottom: 18
            }}
          />

          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              opacity: 0.82
            }}
          >
            Jet2 | PTFS
          </p>

          <h1
            style={{
              margin: "8px 0 12px",
              fontSize: "clamp(42px, 7vw, 78px)",
              lineHeight: 0.95,
              letterSpacing: "-.045em",
              fontWeight: 900
            }}
          >
            EXECUTIVE STAFF
          </h1>

          <p
            style={{
              maxWidth: 650,
              margin: 0,
              fontSize: 18,
              lineHeight: 1.6,
              color: "rgba(255,255,255,.86)"
            }}
          >
            Meet the people responsible for
            leading Jet2 | PTFS and moving the
            organization forward.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "42px 24px 72px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 24
          }}
        >
          <span
            style={{
              width: 5,
              height: 42,
              borderRadius: 999,
              background: "#8b0010"
            }}
          />

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 30,
                letterSpacing: "-.025em"
              }}
            >
              Executive Staff
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                color: "#66707a",
                fontSize: 15
              }}
            >
              Displayed in the order configured by
              the organization team.
            </p>
          </div>
        </div>

        {loading && (
          <div
            style={{
              padding: 34,
              borderRadius: 18,
              background: "#fff",
              border: "1px solid #e1e4e7",
              textAlign: "center",
              color: "#69727d"
            }}
          >
            Loading Executive Staffâ€¦
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              padding: 22,
              borderRadius: 18,
              background: "#fff",
              border: "1px solid #e1e4e7",
              color: "#8b0010",
              fontWeight: 700
            }}
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          orderedPeople.length === 0 && (
            <div
              style={{
                padding: 34,
                borderRadius: 18,
                background: "#fff",
                border: "1px solid #e1e4e7",
                textAlign: "center",
                color: "#69727d"
              }}
            >
              Executive Staff information will
              appear here soon.
            </div>
          )}

        {!loading &&
          !error &&
          orderedPeople.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 18
              }}
            >
              {orderedPeople.map((person, index) => (
                <article
                  key={person.id}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 430,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 18,
                    background:
                      "linear-gradient(160deg, #101820 0%, #070c11 100%)",
                    color: "#fff",
                    boxShadow:
                      "0 12px 30px rgba(18, 22, 28, .14)"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      height: 132,
                      background:
                        "linear-gradient(135deg, #68000b, #a40015)"
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      zIndex: 2,
                      minWidth: 30,
                      height: 30,
                      padding: "0 9px",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 9,
                      background:
                        "rgba(0,0,0,.22)",
                      fontWeight: 900,
                      fontSize: 13
                    }}
                  >
                    {Number(person.displayOrder) > 0
                      ? person.displayOrder
                      : index + 1}
                  </span>

                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: 24
                    }}
                  >
                    {person.photoUrl ? (
                      <img
                        src={person.photoUrl}
                        alt={person.displayName || "Executive"}
                        style={{
                          width: 112,
                          height: 112,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border:
                            "4px solid rgba(255,255,255,.92)",
                          boxShadow:
                            "0 8px 22px rgba(0,0,0,.3)"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 112,
                          height: 112,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          border:
                            "4px solid rgba(255,255,255,.92)",
                          background:
                            "linear-gradient(135deg, #8b0010, #d71920)",
                          fontSize: 38,
                          fontWeight: 900
                        }}
                      >
                        {person.displayName
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      padding: "18px 20px 20px"
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "center",
                        marginTop: -1,
                        padding: "7px 20px",
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, #d71920, #a40015)",
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: ".05em"
                      }}
                    >
                      {person.positionTitle || "Executive"}
                    </div>

                    <h3
                      style={{
                        margin: "16px 0 3px",
                        textAlign: "center",
                        fontSize: 22,
                        lineHeight: 1.15
                      }}
                    >
                      {person.displayName}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        textAlign: "center",
                        color: "#b9c4cf",
                        fontSize: 14,
                        fontWeight: 700
                      }}
                    >
                      {person.positionTitle}
                    </p>

                    <div
                      style={{
                        height: 1,
                        margin: "17px 0",
                        background:
                          "rgba(255,255,255,.14)"
                      }}
                    />

                    <p
                      style={{
                        margin: 0,
                        color: "#e0e5e9",
                        fontSize: 14,
                        lineHeight: 1.55,
                        flex: 1
                      }}
                    >
                      {person.description ||
                        "Provides leadership and strategic direction for Jet2 | PTFS."}
                    </p>

                    <div
                      style={{
                        marginTop: 18,
                        paddingTop: 14,
                        borderTop:
                          "1px solid rgba(255,255,255,.12)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 800
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "7px 11px",
                          borderRadius: 9,
                          background:
                            "rgba(215,25,32,.2)",
                          color: "#ff6670"
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#ef233c"
                          }}
                        />
                        {person.groupType === "leadership"
                          ? "Leadership"
                          : person.groupType || "Executive Staff"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}




/* =========================================================
   MYJET2 REGISTRATION
   ========================================================= */

function MyJet2Registration() {
  const location = useLocation();
  const completed =
    new URLSearchParams(location.search).get("completed") === "1";
  const errorCode =
    new URLSearchParams(location.search).get("error");

  const [step, setStep] = useState(completed ? 3 : 1);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(
    errorCode === "username_taken"
      ? "That myJet2 username is already taken. Please choose another."
      : errorCode === "already_registered"
        ? "This Discord account already has a myJet2 account."
        : ""
  );
  const [transitioning, setTransitioning] = useState(false);

  const usernameValid =
    /^[A-Za-z0-9 _-]{3,20}$/.test(username.trim());

  function transitionTo(nextStep, callback) {
    setTransitioning(true);
    window.setTimeout(() => {
      callback?.();
      setStep(nextStep);
      setTransitioning(false);
    }, 220);
  }

  function continueFromUsername() {
    const cleanUsername = username.trim();

    if (!/^[A-Za-z0-9 _-]{3,20}$/.test(cleanUsername)) {
      setError(
        "Username must be 3â€“20 characters and may contain letters, numbers, spaces, hyphens, or underscores."
      );
      return;
    }

    setError("");
    transitionTo(2);
  }

  function connectDiscord() {
    const cleanUsername = username.trim();

    if (!/^[A-Za-z0-9 _-]{3,20}$/.test(cleanUsername)) {
      setStep(1);
      setError("Please choose a valid myJet2 username first.");
      return;
    }

    setError("");
    setTransitioning(true);
    window.setTimeout(() => {
      window.location.href =
        `/api/myjet2/auth/discord?username=${encodeURIComponent(cleanUsername)}`;
    }, 220);
  }

  const steps = [
    { number: 1, label: "Username" },
    { number: 2, label: "Discord" },
    { number: 3, label: "Complete" }
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #f6f7f8 100%)",
        color: "#17191d",
        fontFamily: "Arial, Helvetica, sans-serif",
        display: "grid",
        placeItems: "center",
        padding: 24
      }}
    >
      <section
        className={
          "myjet2-registration-shell" +
          (transitioning ? " transitioning" : "")
        }
        style={{
          width: "min(620px, 100%)",
          background: "#fff",
          border: "1px solid #e2e3e5",
          borderRadius: 26,
          boxShadow: "0 22px 60px rgba(23,25,29,.08)",
          padding: "clamp(24px, 5vw, 46px)"
        }}
      >
        <Link
          to="/apply"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "#17191d",
            textDecoration: "none",
            fontWeight: 900,
            marginBottom: 34
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              display: "grid",
              placeItems: "center",
              background: "#d71920",
              color: "#fff"
            }}
          >
            J2
          </span>
          <span>my<span style={{ color: "#d71920" }}>Jet2</span></span>
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 34
          }}
        >
          {steps.map((item) => {
            const state =
              item.number < step
                ? "complete"
                : item.number === step
                  ? "current"
                  : "pending";

            const background =
              state === "complete"
                ? "#22c55e"
                : state === "current"
                  ? "#f2c94c"
                  : "#d1d5db";

            return (
              <div key={item.number}>
                <div
                  style={{
                    height: 5,
                    borderRadius: 999,
                    background,
                    marginBottom: 8
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    color: state === "pending" ? "#9ca1a8" : "#44484d",
                    textTransform: "uppercase",
                    letterSpacing: ".08em"
                  }}
                >
                  {item.number}. {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <>
            <div style={{ color: "#d71920", fontSize: 11, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase" }}>
              Welcome to myJet2
            </div>
            <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 1, letterSpacing: "-.05em" }}>
              Choose your username.
            </h1>
            <p style={{ margin: "0 0 26px", color: "#70757c", lineHeight: 1.6, fontSize: 14 }}>
              This is your myJet2 passenger name. It is separate from your Discord username.
            </p>

            <label style={{ display: "grid", gap: 8, fontSize: 12, fontWeight: 900 }}>
              myJet2 username
              <input
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") continueFromUsername();
                }}
                maxLength={20}
                placeholder="e.g. Jet2Pilot"
                autoFocus
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: `1px solid ${error ? "#d71920" : "#d9dade"}`,
                  borderRadius: 12,
                  padding: "13px 14px",
                  fontSize: 15,
                  outline: "none"
                }}
              />
            </label>

            <p style={{ margin: "9px 0 0", color: "#92979e", fontSize: 11 }}>
              3â€“20 characters Â· letters, numbers, spaces, - and _
            </p>

            {error && (
              <div style={{ marginTop: 16, padding: 12, borderRadius: 11, background: "#fff5f5", color: "#a30f16", fontSize: 12, fontWeight: 700 }}>
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={continueFromUsername}
              disabled={!usernameValid}
              style={{
                width: "100%",
                marginTop: 24,
                border: 0,
                borderRadius: 12,
                padding: "14px 18px",
                background: usernameValid ? "#d71920" : "#e4e5e7",
                color: usernameValid ? "#fff" : "#989da3",
                fontWeight: 900,
                cursor: usernameValid ? "pointer" : "not-allowed"
              }}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ color: "#d71920", fontSize: 11, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase" }}>
              Step 2 Â· Discord
            </div>
            <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 1, letterSpacing: "-.05em" }}>
              Connect your Discord.
            </h1>
            <p style={{ margin: "0 0 22px", color: "#70757c", lineHeight: 1.6, fontSize: 14 }}>
              Discord is your myJet2 identity provider. Weâ€™ll verify that youâ€™re a member of the Jet2 | PTFS Discord server. No separate myJet2 password is needed.
            </p>

            <div style={{ padding: 17, borderRadius: 15, background: "#f7f7f8", border: "1px solid #e6e7e9", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#8a8f96", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em" }}>
                Your username
              </div>
              <strong style={{ display: "block", marginTop: 5, fontSize: 18 }}>
                {username.trim()}
              </strong>
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: 12, borderRadius: 11, background: "#fff5f5", color: "#a30f16", fontSize: 12, fontWeight: 700 }}>
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={connectDiscord}
              style={{ width: "100%", border: 0, borderRadius: 12, padding: "14px 18px", background: "#5865f2", color: "#fff", fontWeight: 900, cursor: "pointer" }}
            >
              Continue with Discord
            </button>

            <button
              type="button"
              onClick={() => transitionTo(1)}
              style={{ width: "100%", marginTop: 10, border: "1px solid #d9dade", borderRadius: 12, padding: "12px 18px", background: "#fff", color: "#555a60", fontWeight: 800, cursor: "pointer" }}
            >
              Back
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ width: 62, height: 62, borderRadius: "50%", display: "grid", placeItems: "center", background: "#dcfce7", color: "#16a34a", fontSize: 30, marginBottom: 20 }}>
              âœ“
            </div>
            <div style={{ color: "#16a34a", fontSize: 11, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase" }}>
              Registration complete
            </div>
            <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(34px, 6vw, 50px)", lineHeight: 1, letterSpacing: "-.05em" }}>
              Youâ€™re all set!
            </h1>
            <p style={{ margin: "0 0 26px", color: "#70757c", lineHeight: 1.6, fontSize: 14 }}>
              Your myJet2 account is ready. Welcome aboard{username.trim() ? `, ${username.trim()}` : ""}.
            </p>

            <Link
              to="/myjet2"
              style={{ display: "block", textAlign: "center", textDecoration: "none", borderRadius: 12, padding: "14px 18px", background: "#d71920", color: "#fff", fontWeight: 900 }}
            >
              Enter myJet2 â†’
            </Link>
          </>
        )}
      </section>

      <style>{`
        @keyframes myJet2FadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes myJet2FadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-5px); }
        }
        .myjet2-registration-shell {
          animation: myJet2FadeIn .32s ease both;
        }
        .myjet2-registration-shell.transitioning {
          animation: myJet2FadeOut .22s ease both;
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   MYJET2 PASSENGER FRONT VIEW
   ========================================================= */

function MyJet2() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMyJet2() {
      try {
        /*
         * The Worker owns authentication and myJet2 account data.
         * This first front-view build deliberately uses a graceful
         * empty state until the passenger account API is connected.
         */
        const response = await fetch("/api/myjet2/me", {
          method: "GET",
          credentials: "include"
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            if (!cancelled) {
              setError("Please sign in with Discord to access myJet2.");
            }
            return;
          }

          throw new Error(
            data.error || "Unable to load your myJet2 account."
          );
        }

        if (!cancelled) {
          setAccount({
            ...data,
            ...(data.account || {})
          });
          setError("");
        }
      } catch (requestError) {
        console.error("Unable to load myJet2:", requestError);

        if (!cancelled) {
          /*
           * Keep the front view usable while the passenger API
           * is being finished. We do not invent account data.
           */
          setAccount(null);
          setError("");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMyJet2();

    return () => {
      cancelled = true;
    };
  }, []);

  const user = account?.user || {};
  const points = Number(account?.pointsBalance ?? 0);
  const tier = account?.tier || {
    name: "myJet2 Member",
    description: "Your myJet2 passenger account"
  };
  const nextTier = account?.nextTier || null;
  const progress = Math.max(
    0,
    Math.min(100, Number(account?.progressPercent ?? 0))
  );

  const perks = Array.isArray(account?.perks)
    ? account.perks
    : [];

  const recentActivity = Array.isArray(account?.recentActivity)
    ? account.recentActivity
    : [];

  const priorityPasses = Array.isArray(account?.priorityPasses)
    ? account.priorityPasses
    : [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f7f7f8 48%, #f1f2f3 100%)",
        color: "#17191d",
        fontFamily:
          "Arial, Helvetica, sans-serif"
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 76,
          background: "#fff",
          borderBottom: "1px solid #e6e7e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          position: "sticky",
          top: 0,
          zIndex: 20
        }}
      >
        <Link
          to="/apply"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#17191d",
            textDecoration: "none"
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              display: "grid",
              placeItems: "center",
              background: "#d71920",
              color: "#fff",
              fontWeight: 900,
              fontSize: 16
            }}
          >
            J2
          </div>

          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 20,
                letterSpacing: "-.035em"
              }}
            >
              my<span style={{ color: "#d71920" }}>Jet2</span>
            </div>

            <div
              style={{
                color: "#8a8f96",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".09em",
                textTransform: "uppercase"
              }}
            >
              Passenger account
            </div>
          </div>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              background: "#ececee",
              color: "#666",
              fontWeight: 900
            }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            ) : (
              user.username?.charAt(0)?.toUpperCase() || "P"
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: 1
            }}
          >
            <strong
              style={{
                fontSize: 13
              }}
            >
              {user.username || "Passenger"}
            </strong>

            <span
              style={{
                fontSize: 11,
                color: "#858a91"
              }}
            >
              {account ? "myJet2 Member" : "Passenger"}
            </span>
          </div>
        </div>
      </header>

      <div
        style={{
          width: "min(1180px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "42px 0 70px"
        }}
      >
        {/* Welcome */}
        <section
          style={{
            marginBottom: 24
          }}
        >
          <div
            style={{
              color: "#d71920",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: ".14em",
              textTransform: "uppercase"
            }}
          >
            MYJET2
          </div>

          <h1
            style={{
              margin: "7px 0 8px",
              fontSize: "clamp(34px, 6vw, 54px)",
              lineHeight: .98,
              letterSpacing: "-.05em"
            }}
          >
            Welcome aboard.
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6f757c",
              fontSize: 15,
              lineHeight: 1.55
            }}
          >
            Your flights, points and passenger perks â€” all in one place.
          </p>
        </section>

        {/* Sign-in / loading state */}
        {loading && (
          <section
            style={{
              padding: 28,
              background: "#fff",
              border: "1px solid #e3e4e6",
              borderRadius: 20,
              marginBottom: 24,
              color: "#70757c"
            }}
          >
            Loading your myJet2 accountâ€¦
          </section>
        )}

        {error && (
          <section
            style={{
              padding: 18,
              background: "#fff7f7",
              border: "1px solid #efc5c7",
              borderRadius: 16,
              marginBottom: 24,
              color: "#a30f16",
              fontWeight: 700
            }}
          >
            {error}
            <div style={{ marginTop: 12 }}>
              <Link
                to="/myjet2/register"
                style={{ color: "#a30f16", fontWeight: 900 }}
              >
                Register for myJet2 â†’
              </Link>
            </div>
          </section>
        )}

        {/* Points hero */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 24,
            padding: 30,
            background:
              "linear-gradient(120deg, #640008 0%, #a40013 48%, #d71920 100%)",
            color: "#fff",
            boxShadow: "0 18px 42px rgba(215,25,32,.18)",
            marginBottom: 26
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 330,
              height: 330,
              right: -130,
              top: -180,
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "50%"
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 240,
              height: 240,
              right: 10,
              bottom: -190,
              border: "1px solid rgba(255,255,255,.09)",
              borderRadius: "50%"
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 28,
              alignItems: "center"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  opacity: .78
                }}
              >
                Available points
              </div>

              <div
                style={{
                  margin: "8px 0 7px",
                  fontSize: "clamp(48px, 8vw, 72px)",
                  fontWeight: 950,
                  lineHeight: .92,
                  letterSpacing: "-.065em"
                }}
              >
                {points.toLocaleString()}
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.84)",
                  fontSize: 14
                }}
              >
                Earn points through eligible Jet2 | PTFS activity and use them for myJet2 perks.
              </div>
            </div>

            <div
              style={{
                minWidth: 210,
                padding: 20,
                borderRadius: 17,
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.16)",
                backdropFilter: "blur(8px)"
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  opacity: .72
                }}
              >
                Current status
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: 6,
                  fontSize: 21
                }}
              >
                {tier.name || "myJet2 Member"}
              </strong>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  fontSize: 10,
                  opacity: .78
                }}
              >
                <span>Progress</span>
                <span>
                  {nextTier?.name || "Next level"}
                </span>
              </div>

              <div
                style={{
                  height: 7,
                  marginTop: 7,
                  borderRadius: 99,
                  overflow: "hidden",
                  background: "rgba(255,255,255,.22)"
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    borderRadius: "inherit",
                    background: "#fff"
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick links */}
        <section>
          <div
            style={{
              marginBottom: 14
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 23,
                letterSpacing: "-.03em"
              }}
            >
              Your myJet2
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#777d84",
                fontSize: 13
              }}
            >
              Manage your passenger benefits and account.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: 14
            }}
          >
            {[
              ["ðŸŽ", "My Perks", "View and redeem available benefits."],
              ["âœˆï¸", "My Flights", "View upcoming and previous flights."],
              ["ðŸŽ«", "Priority Pass", "View active priority passes."],
              ["ðŸ“œ", "Points History", "See how your points have changed."]
            ].map(([icon, title, description]) => (
              <Link
                key={title}
                to="#"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                  border: "1px solid #e3e4e6",
                  borderRadius: 17,
                  padding: 19,
                  minHeight: 145,
                  transition: "transform .15s ease"
                }}
              >
                <div
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background: "#fff0f1",
                    fontSize: 19,
                    marginBottom: 16
                  }}
                >
                  {icon}
                </div>

                <strong
                  style={{
                    display: "block",
                    fontSize: 15
                  }}
                >
                  {title}
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: "#777d84",
                    fontSize: 12,
                    lineHeight: 1.45
                  }}
                >
                  {description}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Perks */}
        <section style={{ marginTop: 34 }}>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 14
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 23,
                  letterSpacing: "-.03em"
                }}
              >
                Featured perks
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#777d84",
                  fontSize: 13
                }}
              >
                Benefits available through myJet2.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: 15
            }}
          >
            {(perks.length > 0
              ? perks.slice(0, 3)
              : [
                  {
                    name: "Priority Pass",
                    description:
                      "Unlock priority boarding benefits when eligible.",
                    pointsCost: null,
                    status: "Coming soon"
                  },
                  {
                    name: "Flight Upgrades",
                    description:
                      "Use eligible myJet2 points toward flight upgrades.",
                    pointsCost: null,
                    status: "Coming soon"
                  },
                  {
                    name: "Member Benefits",
                    description:
                      "Unlock additional benefits as your account progresses.",
                    pointsCost: null,
                    status: "Coming soon"
                  }
                ]
            ).map((perk) => (
              <article
                key={perk.id || perk.name}
                style={{
                  background: "#fff",
                  border: "1px solid #e3e4e6",
                  borderRadius: 18,
                  padding: 21
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: 12
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      background: "#fff0f1"
                    }}
                  >
                    â­
                  </div>

                  <span
                    style={{
                      padding: "5px 9px",
                      borderRadius: 999,
                      background: "#f1f1f2",
                      color: "#6d7278",
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: ".06em"
                    }}
                  >
                    {perk.status || "Available"}
                  </span>
                </div>

                <h3
                  style={{
                    margin: "17px 0 7px",
                    fontSize: 16
                  }}
                >
                  {perk.name}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#777d84",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    minHeight: 56
                  }}
                >
                  {perk.description}
                </p>

                <div
                  style={{
                    marginTop: 17,
                    paddingTop: 13,
                    borderTop: "1px solid #ededee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <strong
                    style={{
                      fontSize: 13
                    }}
                  >
                    {perk.pointsCost != null
                      ? `${Number(perk.pointsCost).toLocaleString()} points`
                      : "Details coming soon"}
                  </strong>

                  <button
                    type="button"
                    disabled
                    style={{
                      border: 0,
                      borderRadius: 9,
                      padding: "8px 11px",
                      background: "#ededee",
                      color: "#858a90",
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: "not-allowed"
                    }}
                  >
                    {perk.pointsCost != null
                      ? "Redeem"
                      : "Coming soon"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Activity + priority */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: 15,
            marginTop: 34
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e3e4e6",
              borderRadius: 18,
              padding: 22
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 17
              }}
            >
              Recent activity
            </h3>

            {recentActivity.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 17
                }}
              >
                {recentActivity.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: 13,
                      borderRadius: 11,
                      background: "#f7f7f8",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14
                    }}
                  >
                    <span>{item.description || item.source}</span>
                    <strong>
                      {item.amount > 0 ? "+" : ""}
                      {item.amount}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 10px 12px",
                  color: "#7b8087"
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    marginBottom: 7
                  }}
                >
                  ðŸ“œ
                </div>

                <strong
                  style={{
                    display: "block",
                    color: "#333",
                    marginBottom: 5
                  }}
                >
                  No activity yet
                </strong>

                <span
                  style={{
                    fontSize: 12
                  }}
                >
                  Your points activity will appear here.
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e3e4e6",
              borderRadius: 18,
              padding: 22
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 17
              }}
            >
              Priority Pass
            </h3>

            {priorityPasses.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 17
                }}
              >
                {priorityPasses.slice(0, 4).map((pass) => (
                  <div
                    key={pass.id}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: "#fff5f5",
                      border: "1px solid #f2d0d2"
                    }}
                  >
                    <strong>
                      {pass.passType === "permanent"
                        ? "Permanent Priority Pass"
                        : "One-Time Priority Pass"}
                    </strong>

                    <div
                      style={{
                        marginTop: 4,
                        color: "#777",
                        fontSize: 12
                      }}
                    >
                      {pass.status || "Active"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 10px 12px",
                  color: "#7b8087"
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    marginBottom: 7
                  }}
                >
                  ðŸŽ«
                </div>

                <strong
                  style={{
                    display: "block",
                    color: "#333",
                    marginBottom: 5
                  }}
                >
                  No active passes
                </strong>

                <span
                  style={{
                    fontSize: 12
                  }}
                >
                  Your priority passes will appear here.
                </span>
              </div>
            )}
          </div>
        </section>

        <footer
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid #dedfe1",
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            color: "#858a90",
            fontSize: 11
          }}
        >
          <span>myJet2 Â· Jet2 | PTFS</span>
          <span>Passenger benefits programme</span>
        </footer>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .myjet2-page-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}



/* =========================================================
   APPLICATIONS
   ========================================================= */

function ApplicationsPage() {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState("");

  const params = new URLSearchParams(location.search);
  const submitted = params.get("submitted") === "1";
  const submittedId = params.get("id") || "";
  const errorCode = params.get("error") || "";

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        const response = await fetch("/api/applications/types", {
          method: "GET",
          credentials: "omit"
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Unable to load applications.");
        if (!cancelled) setApplications(Array.isArray(data.applications) ? data.applications : []);
      } catch (requestError) {
        console.error("Unable to load applications:", requestError);
        if (!cancelled) setError("We couldn't load the available applications. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadApplications();
    return () => { cancelled = true; };
  }, []);

  const questions = selectedType?.questions || [];
  const currentQuestion = questions[questionIndex] || null;
  const currentAnswer = currentQuestion ? String(answers[currentQuestion.id] || "") : "";
  const isLastQuestion = questionIndex === questions.length - 1;
  const currentValid = !currentQuestion || !currentQuestion.required || currentAnswer.trim().length > 0;

  function beginApplication(type) {
    setError("");
    setSelectedType(type);
    setAnswers({});
    setQuestionIndex(0);
    setTransitioning(false);
  }

  function backToTypes() {
    setTransitioning(true);
    window.setTimeout(() => {
      setSelectedType(null);
      setAnswers({});
      setQuestionIndex(0);
      setTransitioning(false);
    }, 180);
  }

  function changeQuestion(nextIndex) {
    if (nextIndex < 0 || nextIndex >= questions.length) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setQuestionIndex(nextIndex);
      setTransitioning(false);
    }, 180);
  }

  function updateAnswer(value) {
    if (!currentQuestion) return;
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
    if (error) setError("");
  }

  async function submitApplication() {
    if (!selectedType || submitting) return;

    const missing = questions.find((question) => {
      const answer = String(answers[question.id] || "").trim();
      return question.required && !answer;
    });

    if (missing) {
      const missingIndex = questions.findIndex((question) => question.id === missing.id);
      setError("Please answer every required question before submitting.");
      setQuestionIndex(missingIndex);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/applications/start", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          typeKey: selectedType.typeKey,
          answers
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to start your application.");
      if (!data.authorizationUrl) throw new Error("Discord verification could not be started.");

      window.location.href = data.authorizationUrl;
    } catch (requestError) {
      console.error("Unable to submit application:", requestError);
      setError(requestError.message || "Unable to submit your application.");
      setSubmitting(false);
    }
  }

  const errorMessage =
    errorCode === "not_a_member"
      ? "You must be a member of the Jet2 | PTFS Discord server to submit an application."
      : errorCode === "already_applied"
        ? "You already have an active application for this department."
        : errorCode === "application_expired"
          ? "That application session expired. Please start again."
          : errorCode === "invalid_answers"
            ? "Your application could not be verified. Please start again."
            : "";

  if (submitted) {
    return (
      <main className="public-page">
        <div className="public-card" style={{ maxWidth: 720, width: "100%" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", background: "#dcfce7", color: "#16a34a", fontSize: 30, marginBottom: 20 }}>âœ“</div>
          <span className="section-label">APPLICATION SUBMITTED</span>
          <h1 style={{ margin: "7px 0 12px" }}>You're all set.</h1>
          <p style={{ color: "#666", lineHeight: 1.7, margin: 0 }}>
            Your application has been verified through Discord and sent to the Jet2 | PTFS team for review.
          </p>
          {submittedId && (
            <div style={{ marginTop: 22, padding: 15, borderRadius: 13, background: "#f7f7f8", border: "1px solid #e5e6e8", fontWeight: 900 }}>
              Application ID: {submittedId}
            </div>
          )}
          <p style={{ marginTop: 18, color: "#858a90", fontSize: 13, lineHeight: 1.6 }}>
            Watch your Discord DMs for the final result once the application has been reviewed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="public-page" style={{ alignItems: "start", paddingTop: 50 }}>
      <div className={"application-shell" + (transitioning ? " transitioning" : "")}>
        <div className="application-topbar">
          <div>
            <span className="header-kicker">JET2 | PTFS</span>
            <h1>Applications</h1>
          </div>
          <div className="dashboard-badge"><span className="status-dot"></span>Applications open</div>
        </div>

        {(error || errorMessage) && (
          <div className="application-error" role="alert">{error || errorMessage}</div>
        )}

        {loading ? (
          <section className="application-card">
            <span className="section-label">JET2 | PTFS</span>
            <h2>Loading applicationsâ€¦</h2>
            <p>Preparing the current application opportunities.</p>
          </section>
        ) : !selectedType ? (
          <section className="application-card">
            <span className="section-label">JOIN THE TEAM</span>
            <h2>Where would you like to apply?</h2>
            <p className="application-lead">Choose an application below. Each department has its own questions and review team.</p>

            <div className="application-type-grid">
              {applications.map((application) => (
                <button
                  key={application.typeKey}
                  type="button"
                  className="application-type-card"
                  onClick={() => beginApplication(application)}
                >
                  <span className="application-type-icon">âœ¦</span>
                  <span>
                    <strong>{application.name}</strong>
                    <small>{application.department}</small>
                    <em>{application.description}</em>
                  </span>
                  <b>â†’</b>
                </button>
              ))}
            </div>

            {!applications.length && (
              <div className="application-empty">There are no applications open right now.</div>
            )}
          </section>
        ) : (
          <section className="application-card">
            <button type="button" className="application-back" onClick={backToTypes}>â† All applications</button>

            <div className="application-progress-row">
              <span>Question {questionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((questionIndex + 1) / Math.max(questions.length, 1)) * 100)}%</span>
            </div>
            <div className="application-progress"><span style={{ width: `${((questionIndex + 1) / Math.max(questions.length, 1)) * 100}%` }} /></div>

            <div className="application-question">
              <span className="section-label">{selectedType.name.toUpperCase()}</span>
              <h2>{currentQuestion?.prompt}</h2>
              {currentQuestion?.helpText && <p>{currentQuestion.helpText}</p>}
              <textarea
                value={currentAnswer}
                onChange={(event) => updateAnswer(event.target.value)}
                maxLength={currentQuestion?.maxLength || 1500}
                autoFocus
                placeholder="Write your answer hereâ€¦"
              />
              <div className="application-answer-meta">
                <span>{currentQuestion?.required ? "Required" : "Optional"}</span>
                <span>{currentAnswer.length}/{currentQuestion?.maxLength || 1500}</span>
              </div>
            </div>

            <div className="application-navigation">
              <button type="button" className="secondary-button" onClick={() => questionIndex === 0 ? backToTypes() : changeQuestion(questionIndex - 1)}>Back</button>
              {isLastQuestion ? (
                <button type="button" className="primary-button" onClick={submitApplication} disabled={!currentValid || submitting}>
                  {submitting ? "Preparing Discord verificationâ€¦" : "Review & submit â†’"}
                </button>
              ) : (
                <button type="button" className="primary-button" onClick={() => currentValid && changeQuestion(questionIndex + 1)} disabled={!currentValid}>Next â†’</button>
              )}
            </div>
          </section>
        )}

        <p className="application-footer-note">Applications are reviewed by the relevant Jet2 | PTFS team. Discord membership is verified server-side before an application is submitted.</p>
      </div>

      <style>{`
        .application-shell { width: min(980px, 100%); animation: applicationFadeIn .28s ease both; }
        .application-shell.transitioning { animation: applicationFadeOut .18s ease both; }
        .application-topbar { display:flex; justify-content:space-between; align-items:end; gap:20px; margin-bottom:22px; flex-wrap:wrap; }
        .application-topbar h1 { margin:5px 0 0; font-size:clamp(30px,5vw,44px); letter-spacing:-.04em; }
        .application-card { background:#fff; border:1px solid #e1e3e6; border-radius:24px; box-shadow:0 18px 55px rgba(23,25,29,.07); padding:clamp(24px,5vw,42px); }
        .application-card h2 { margin:7px 0 10px; font-size:clamp(27px,4vw,38px); letter-spacing:-.04em; }
        .application-lead { margin:0; color:#70757c; line-height:1.65; }
        .application-type-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:28px; }
        .application-type-card { display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:14px; text-align:left; border:1px solid #e1e3e6; background:#fff; border-radius:17px; padding:17px; cursor:pointer; transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease; }
        .application-type-card:hover { transform:translateY(-2px); border-color:#d71920; box-shadow:0 10px 25px rgba(23,25,29,.08); }
        .application-type-icon { width:40px; height:40px; display:grid; place-items:center; border-radius:12px; background:#fff0f1; color:#d71920; font-weight:900; }
        .application-type-card strong,.application-type-card small,.application-type-card em { display:block; }
        .application-type-card strong { color:#17191d; font-size:16px; }
        .application-type-card small { color:#d71920; font-weight:800; margin-top:3px; }
        .application-type-card em { color:#747980; font-size:12px; line-height:1.5; font-style:normal; margin-top:6px; }
        .application-type-card b { color:#d71920; font-size:20px; }
        .application-empty { margin-top:22px; padding:18px; border-radius:14px; background:#f7f7f8; color:#777; }
        .application-back { border:0; background:none; padding:0; color:#6c7178; font-weight:800; cursor:pointer; margin-bottom:24px; }
        .application-progress-row { display:flex; justify-content:space-between; color:#777; font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
        .application-progress { height:6px; border-radius:999px; background:#e7e8ea; overflow:hidden; margin:9px 0 34px; }
        .application-progress span { display:block; height:100%; background:#d71920; transition:width .2s ease; }
        .application-question h2 { margin-top:7px; }
        .application-question p { color:#70757c; line-height:1.6; margin:0 0 20px; }
        .application-question textarea { width:100%; min-height:210px; box-sizing:border-box; resize:vertical; border:1px solid #d9dade; border-radius:15px; padding:16px; font:inherit; font-size:15px; line-height:1.6; outline:none; transition:border-color .15s ease,box-shadow .15s ease; }
        .application-question textarea:focus { border-color:#d71920; box-shadow:0 0 0 3px rgba(215,25,32,.08); }
        .application-answer-meta { display:flex; justify-content:space-between; color:#8a8f96; font-size:11px; margin-top:7px; }
        .application-navigation { display:flex; justify-content:space-between; gap:12px; margin-top:24px; }
        .application-navigation .primary-button,.application-navigation .secondary-button { border-radius:12px; padding:13px 18px; font-weight:900; cursor:pointer; }
        .application-navigation .primary-button { border:0; background:#d71920; color:#fff; }
        .application-navigation .primary-button:disabled { background:#dedfe1; color:#92969c; cursor:not-allowed; }
        .application-navigation .secondary-button { border:1px solid #d9dade; background:#fff; color:#555a60; }
        .application-error { margin-bottom:15px; padding:13px 15px; border:1px solid #efb7ba; border-radius:12px; background:#fff4f4; color:#a30f16; font-size:13px; font-weight:700; }
        .application-footer-note { color:#8a8f96; text-align:center; font-size:11px; line-height:1.6; margin:15px auto 0; max-width:760px; }
        @keyframes applicationFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes applicationFadeOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-4px); } }
        @media (max-width:700px) { .application-type-grid { grid-template-columns:1fr; } .application-navigation { flex-direction:column-reverse; } .application-navigation button { width:100%; } }
      `}</style>
    </main>
  );
}

function StaffPortal() {
  const [authData, setAuthData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const data =
          await getCurrentUser();

        if (cancelled) {
          return;
        }

        if (!data) {
          window.location.href =
            "/api/auth/discord";

          return;
        }

        setAuthData(data);
      } catch (error) {
        console.error(
          "Unable to load staff authentication:",
          error
        );

        if (!cancelled) {
          window.location.href =
            "/api/auth/discord";
        }

        return;
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="public-page">
        <div className="public-card">
          <span className="header-kicker">
            JET2 | PTFS
          </span>

          <h1>
            Verifying staff access...
          </h1>

          <p>
            Checking your Discord account
            and Staff Portal permissions.
          </p>

          <div className="dashboard-badge">
            <span className="status-dot"></span>
            Authenticating
          </div>
        </div>
      </main>
    );
  }

  if (!authData) {
    return null;
  }

  return (
    <StaffLayout
      authData={authData}
    >
      <Routes>
        <Route
          index
          element={
            <StaffDashboard
              authData={authData}
            />
          }
        />

        <Route
          path="flights"
          element={
            <StaffFlights />
          }
        />

        <Route
          path="staff"
          element={
            <StaffMembers />
          }
        />

        <Route
          path="training"
          element={
            <StaffTraining />
          }
        />
      </Routes>
    </StaffLayout>
  );
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ApplicationsPage />}
        />

        <Route
          path="/apply"
          element={<ApplicationsPage />}
        />

        <Route
          path="/leadership"
          element={<ExecutiveStaffPage />}
        />

        <Route
          path="/myjet2/register"
          element={<MyJet2Registration />}
        />

        <Route
          path="/myjet2"
          element={<MyJet2 />}
        />

        <Route
          path="/staff/owner/*"
          element={<OwnerPortal />}
        />

        <Route
          path="/staff/*"
          element={<StaffPortal />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
