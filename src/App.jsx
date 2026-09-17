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

  if (!response.ok) return null;

  const data = await response.json();
  return data.authenticated ? data : null;
}

/* =========================================================
   DISPLAY HELPERS
   ========================================================= */

function getRankTitle(rank) {
  const titleMap = {
    CHM: "Chairman",
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
    PRM: "PR Manager",
    SPRC: "Senior PR Coordinator",
    PRC: "PR Coordinator",
    PRI: "PR Intern",
    BM: "Brand Manager",
    SMS: "Senior Marketing Specialist",
    MS: "Marketing Specialist",
    SOM: "Senior Operations Manager",
    FOM: "Flight Operations Manager",
    FOI: "Flight Operations Intern"
  };

  const rawTitle = rank?.title || rank?.name || "Staff";
  return titleMap[rawTitle] || rawTitle;
}

function getOrganizationalUnit(rank, positions) {
  if (positions?.length > 0) {
    return positions
      .map((position) => position.department)
      .filter(Boolean)
      .filter((department, index, array) => array.indexOf(department) === index);
  }

  const rawRank = rank?.title || rank?.name || "";

  if (["CHM", "VCHM", "CEO", "COO"].includes(rawRank)) {
    return ["Leadership"];
  }

  if (["CDO", "CTO", "CHRO", "CAO", "CMO", "COM", "CXO"].includes(rawRank)) {
    return ["Board of Directors"];
  }

  return [];
}

/* =========================================================
   MODULE ACCESS
   ========================================================= */

function getAvailableModules(permissions = []) {
  const permissionSet = new Set(Array.isArray(permissions) ? permissions : []);
  const modules = [];

  if (permissionSet.has("portal.view")) {
    modules.push({ label: "Dashboard", path: "/staff" });
  }

  if (
    permissionSet.has("flights.view") ||
    permissionSet.has("flights.create") ||
    permissionSet.has("flights.edit") ||
    permissionSet.has("flights.manage")
  ) {
    modules.push({ label: "Flight Operations", path: "/staff/flights" });
  }

  if (permissionSet.has("staff.view") || permissionSet.has("staff.manage")) {
    modules.push({ label: "Staff Management", path: "/staff/staff" });
  }

  if (permissionSet.has("training.view") || permissionSet.has("training.manage")) {
    modules.push({ label: "Training", path: "/staff/training" });
  }

  if (permissionSet.has("careers.view") || permissionSet.has("careers.manage")) {
    modules.push({ label: "Careers", path: "/staff" });
  }

  if (
    permissionSet.has("announcements.view") ||
    permissionSet.has("announcements.manage")
  ) {
    modules.push({ label: "Announcements", path: "/staff" });
  }

  if (permissionSet.has("admin.review") || permissionSet.has("admin.owner")) {
    modules.push({ label: "Administration", path: "/staff/owner" });
  }

  return modules;
}

/* =========================================================
   SIDEBAR SECTION
   ========================================================= */

function SidebarSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="sidebar-section">
      <button
        type="button"
        className="sidebar-section-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={open ? "sidebar-chevron open" : "sidebar-chevron"}>›</span>
      </button>

      {open && <div className="sidebar-section-content">{children}</div>}
    </div>
  );
}

/* =========================================================
   LOGOUT
   ========================================================= */

async function handleLogout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    window.location.href = "/";
  }
}

/* =========================================================
   STAFF LAYOUT
   ========================================================= */

function StaffLayout({ children, authData }) {
  const location = useLocation();

  const navigation = [
    { label: "Dashboard", path: "/staff" },
    { label: "Flights", path: "/staff/flights" },
    { label: "Staff", path: "/staff/staff" },
    { label: "Training", path: "/staff/training" }
  ];

  const user = authData?.user;
  const rank = authData?.rank;
  const positions = authData?.positions || [];
  const permissions = authData?.permissions || [];

  const rankTitle = getRankTitle(rank);
  const departments = getOrganizationalUnit(rank, positions);
  const availableModules = getAvailableModules(permissions);

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <div className="staff-brand">
          <div className="brand-mark">J2</div>
          <div>
            <strong>Jet2 | PTFS</strong>
            <span>Staff Portal</span>
          </div>
        </div>

        <nav className="staff-navigation">
          <span className="nav-heading">OPERATIONS</span>

          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user ? (
            <>
              <div className="staff-user">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="staff-avatar" />
                ) : (
                  <div className="staff-avatar-placeholder">
                    {user.username?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                <div className="staff-user-info">
                  <strong>{user.username}</strong>
                  <span className="staff-user-meta">{rankTitle}</span>

                  {departments.length > 0 && (
                    <span className="staff-user-department">
                      {departments.join(" · ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="sidebar-details">
                <SidebarSection title="Modules Available">
                  {availableModules.length > 0 ? (
                    <div className="module-list">
                      {availableModules.map((module) => (
                        <Link key={module.label} to={module.path} className="module-item">
                          <span className="module-check">✓</span>
                          <span>{module.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span className="sidebar-empty">No modules available.</span>
                  )}
                </SidebarSection>

                <SidebarSection title="Departments">
                  {departments.length > 0 ? (
                    <div className="sidebar-value-list">
                      {departments.map((department) => (
                        <span key={department} className="sidebar-value">{department}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="sidebar-empty">No department assignments.</span>
                  )}
                </SidebarSection>

                <SidebarSection title="Rank Information">
                  <div className="rank-info">
                    <div>
                      <span>Rank</span>
                      <strong>{rankTitle}</strong>
                    </div>

                    {rank?.level && (
                      <div>
                        <span>Hierarchy Level</span>
                        <strong>{rank.level}</strong>
                      </div>
                    )}
                  </div>
                </SidebarSection>

                <SidebarSection title="Account & Security">
                  <div className="security-info">
                    <div>
                      <span>Discord Account</span>
                      <strong className="security-good">Connected</strong>
                    </div>
                    <div>
                      <span>Staff Session</span>
                      <strong className="security-good">Active</strong>
                    </div>
                  </div>
                </SidebarSection>
              </div>

              <button type="button" className="logout-button" onClick={handleLogout}>
                <span>↪</span>
                Log Out
              </button>
            </>
          ) : (
            <>
              <span>Staff access</span>
              <small>Discord verification required</small>
            </>
          )}
        </div>
      </aside>

      <div className="staff-content">
        <header className="staff-header">
          <div>
            <span className="header-kicker">JET2 | PTFS</span>
            <h1>Staff Portal</h1>
          </div>

          <div className="header-status">
            <span className="status-dot"></span>
            System online
          </div>
        </header>

        <div className="staff-page">{children}</div>
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
        <span className="header-kicker">JET2 | PTFS</span>
        <h1>Welcome aboard.</h1>
        <p>The public Jet2 | PTFS website is being built.</p>

        <Link className="primary-button" to="/staff">
          Open Staff Portal
        </Link>
      </div>
    </main>
  );
}

/* =========================================================
   STAFF DASHBOARD
   ========================================================= */

function StaffDashboard({ authData }) {
  const user = authData?.user;
  const rank = authData?.rank;
  const positions = authData?.positions || [];

  const departmentNames = getOrganizationalUnit(rank, positions);
  const rankTitle = getRankTitle(rank);

  return (
    <div>
      <section className="welcome-section">
        <div>
          <span className="section-label">STAFF DASHBOARD</span>
          <h2>Hello {user?.username || "Staff Member"}!</h2>
          <p>
            Welcome to the Jet2 | PTFS Staff Portal. Manage flights, staff,
            training and airline operations from one place.
          </p>
        </div>

        <div className="dashboard-badge">
          <span className="status-dot"></span>
          Operations ready
        </div>
      </section>

      <section className="dashboard-grid">
        <Link to="/staff/flights" className="dashboard-card">
          <span className="card-icon">✈</span>
          <div>
            <h3>Flight Operations</h3>
            <p>Create and manage flights, hosts, schedules and boarding.</p>
          </div>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/staff/staff" className="dashboard-card">
          <span className="card-icon">◉</span>
          <div>
            <h3>Staff Management</h3>
            <p>Manage staff records, roles and operational access.</p>
          </div>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/staff/training" className="dashboard-card">
          <span className="card-icon">✓</span>
          <div>
            <h3>Training</h3>
            <p>Track training programmes, progress and certifications.</p>
          </div>
          <span className="card-arrow">→</span>
        </Link>

        <div className="dashboard-card disabled-card">
          <span className="card-icon">▣</span>
          <div>
            <h3>Applications</h3>
            <p>Review and manage staff applications.</p>
          </div>
          <span className="coming-soon">COMING SOON</span>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="section-label">YOUR ACCESS</span>
            <h3>Staff profile</h3>
          </div>
        </div>

        <div className="status-list">
          <div className="status-row">
            <span>Discord account</span>
            <strong className="online-text">{user?.username || "Verified"}</strong>
          </div>
          <div className="status-row">
            <span>Rank</span>
            <strong className="online-text">{rankTitle}</strong>
          </div>
          <div className="status-row">
            <span>Department</span>
            <strong className="online-text">
              {departmentNames.length > 0 ? departmentNames.join(" · ") : "Leadership"}
            </strong>
          </div>
          <div className="status-row">
            <span>Staff Portal</span>
            <strong className="online-text">Authorized</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   STAFF PLACEHOLDERS
   ========================================================= */

function StaffFlights() {
  return (
    <div className="placeholder-page">
      <span className="section-label">FLIGHT OPERATIONS</span>
      <h2>Flight Management</h2>
      <p>Flight creation, hosts, aircraft, boarding and operational controls will live here.</p>
    </div>
  );
}

function StaffMembers() {
  return (
    <div className="placeholder-page">
      <span className="section-label">STAFF</span>
      <h2>Staff Management</h2>
      <p>Staff records, roles and permissions will live here.</p>
    </div>
  );
}

function StaffTraining() {
  return (
    <div className="placeholder-page">
      <span className="section-label">TRAINING</span>
      <h2>Training</h2>
      <p>Training programmes, requirements and progress will live here.</p>
    </div>
  );
}

/* =========================================================
   OWNER CONTROL ROOM API
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

/* =========================================================
   OWNER LOGIN
   ========================================================= */

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
    } catch (requestError) {
      console.error("Owner login request failed:", requestError);
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
        <p>
          This area requires a separate privileged security check. Your Discord
          identity has already been verified.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "16px",
            marginTop: "24px",
            textAlign: "left"
          }}
        >
          <label style={{ display: "grid", gap: "7px" }}>
            <span style={{ fontWeight: 700 }}>Owner Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your Owner password"
              disabled={submitting}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #d9d9d9",
                borderRadius: "10px",
                fontSize: "16px"
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "7px" }}>
            <span style={{ fontWeight: 700 }}>Authenticator Code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={totp}
              onChange={(event) =>
                setTotp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="6-digit code"
              maxLength={6}
              disabled={submitting}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #d9d9d9",
                borderRadius: "10px",
                fontSize: "18px",
                letterSpacing: "4px"
              }}
            />
          </label>

          {error && (
            <div
              role="alert"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fff1f1",
                border: "1px solid #f0b8b8",
                color: "#a40000",
                fontWeight: 600
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={submitting || !password || totp.length !== 6}
            style={{
              border: "none",
              cursor:
                submitting || !password || totp.length !== 6
                  ? "not-allowed"
                  : "pointer",
              opacity:
                submitting || !password || totp.length !== 6 ? 0.6 : 1
            }}
          >
            {submitting ? "Verifying..." : "Enter Owner Control Room"}
          </button>
        </form>

        <div
          style={{
            marginTop: "22px",
            paddingTop: "18px",
            borderTop: "1px solid #eeeeee",
            fontSize: "13px",
            color: "#666666"
          }}
        >
          <strong>Security:</strong> Owner sessions expire after 30 minutes and
          are protected separately from your normal Staff Portal session.
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   OWNER ADMINISTRATION
   ========================================================= */

function AdministrationPanel() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    {
      id: "overview",
      icon: "⚙",
      title: "General Administration",
      description: "Core airline-wide settings and administrative controls."
    },
    {
      id: "organization",
      icon: "👥",
      title: "Organization",
      description: "Board, leadership and organizational structure."
    },
    {
      id: "website",
      icon: "🌐",
      title: "Website",
      description: "Public website, IFE and portal presentation settings."
    },
    {
      id: "fleet",
      icon: "✈",
      title: "Fleet",
      description: "Aircraft records and fleet presentation."
    },
    {
      id: "navigation",
      icon: "☰",
      title: "Navigation",
      description: "Portal menu structure and available navigation items."
    }
  ];

  return (
    <div className="owner-admin">
      <div className="owner-admin-heading">
        <div>
          <span className="section-label">OWNER ADMINISTRATION</span>
          <h2>Administration</h2>
          <p>
            Central controls for the Jet2 | PTFS website and staff platform.
            These controls are visible only inside the privileged Owner session.
          </p>
        </div>

        <span className="dashboard-badge">
          <span className="status-dot"></span>
          Owner only
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(210px, 260px) 1fr",
          gap: "20px",
          marginTop: "28px"
        }}
      >
        <div className="dashboard-panel" style={{ margin: 0, padding: "10px" }}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                background:
                  activeSection === section.id ? "#f8e6e7" : "transparent",
                borderRadius: "10px",
                padding: "13px 14px",
                cursor: "pointer",
                display: "flex",
                gap: "11px",
                alignItems: "center",
                marginBottom: "4px"
              }}
            >
              <span style={{ fontSize: "19px" }}>{section.icon}</span>
              <span>
                <strong style={{ display: "block" }}>{section.title}</strong>
                <small style={{ color: "#6b6b6b" }}>{section.description}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="dashboard-panel" style={{ margin: 0 }}>
          {activeSection === "overview" && (
            <AdminOverview />
          )}

          {activeSection === "organization" && (
            <AdminComingSoon
              title="Organization Management"
              description="Board and Leadership Team controls will be connected here. The existing Discord role hierarchy remains the source of staff authorization."
            />
          )}

          {activeSection === "website" && (
            <AdminComingSoon
              title="Website & IFE"
              description="Public website content and the future myJet2 / IFE administration tools will be connected here."
            />
          )}

          {activeSection === "fleet" && (
            <AdminComingSoon
              title="Fleet Management"
              description="Aircraft records, names, aircraft images and fleet presentation will be managed here."
            />
          )}

          {activeSection === "navigation" && (
            <AdminComingSoon
              title="Navigation Management"
              description="Owner-controlled portal menu items will be connected here using the existing menu_items database foundation."
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const cards = [
    {
      icon: "🔐",
      title: "Security boundary",
      text: "Administration is displayed only after the server has verified the Owner identity and privileged session."
    },
    {
      icon: "🗄",
      title: "Database foundation",
      text: "The project already contains database foundations for owner security, menu items, fleet aircraft and organization profiles."
    },
    {
      icon: "🧩",
      title: "Modular controls",
      text: "Website, organization, fleet and navigation controls can be added independently without changing the Owner login flow."
    }
  ];

  return (
    <>
      <span className="section-label">CONTROL CENTER</span>
      <h3 style={{ marginTop: "6px" }}>Administration overview</h3>
      <p style={{ color: "#666", lineHeight: 1.6 }}>
        This is the first usable layer of the Owner administration area.
        The individual management systems can now be built behind this
        owner-only boundary.
      </p>

      <div
        style={{
          display: "grid",
          gap: "12px",
          marginTop: "22px"
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="dashboard-card"
            style={{ margin: 0 }}
          >
            <span className="card-icon">{card.icon}</span>
            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminComingSoon({ title, description }) {
  return (
    <div style={{ textAlign: "center", padding: "38px 20px" }}>
      <span style={{ fontSize: "36px" }}>⚙</span>
      <h3 style={{ marginTop: "12px" }}>{title}</h3>
      <p style={{ color: "#666", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
        {description}
      </p>

      <span
        className="coming-soon"
        style={{
          display: "inline-block",
          marginTop: "18px"
        }}
      >
        NEXT BUILD
      </span>
    </div>
  );
}

/* =========================================================
   OWNER CONTROL ROOM
   ========================================================= */

function OwnerControlRoom({ ownerData, onLogout }) {
  const username = ownerData?.user?.username || "Owner";
  const rankTitle = getRankTitle(ownerData?.rank);
  const [view, setView] = useState("home");

  return (
    <main className="public-page">
      <div
        className="public-card"
        style={{
          maxWidth: "1100px",
          width: "100%"
        }}
      >
        <span className="header-kicker">JET2 | PTFS</span>

        <h1>Owner Control Room</h1>

        <p>
          Welcome, {username}. Your privileged Owner session is active.
        </p>

        {view === "home" ? (
          <>
            <div className="dashboard-grid" style={{ marginTop: "28px" }}>
              <div className="dashboard-card">
                <span className="card-icon">🔐</span>
                <div>
                  <h3>Owner Security</h3>
                  <p>Password and authenticator verification completed successfully.</p>
                </div>
              </div>

              <div className="dashboard-card">
                <span className="card-icon">◉</span>
                <div>
                  <h3>Verified Identity</h3>
                  <p>{username} · {rankTitle}</p>
                </div>
              </div>

              <button
                type="button"
                className="dashboard-card"
                onClick={() => setView("administration")}
                style={{
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  font: "inherit"
                }}
              >
                <span className="card-icon">⚙</span>
                <div>
                  <h3>Administration</h3>
                  <p>Manage owner-only website, organization, fleet and portal controls.</p>
                </div>
                <span className="card-arrow">→</span>
              </button>

              <div className="dashboard-card">
                <span className="card-icon">📋</span>
                <div>
                  <h3>Audit & Security</h3>
                  <p>Security events and administrative audit tools will live here next.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ marginTop: "28px" }}>
            <button
              type="button"
              className="primary-button"
              onClick={() => setView("home")}
              style={{
                border: "none",
                cursor: "pointer",
                marginBottom: "22px"
              }}
            >
              ← Back to Control Room
            </button>

            <AdministrationPanel />
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "28px"
          }}
        >
          <span className="dashboard-badge">
            <span className="status-dot"></span>
            Owner session active
          </span>

          <button
            type="button"
            className="primary-button"
            onClick={onLogout}
            style={{
              border: "none",
              cursor: "pointer"
            }}
          >
            Exit Owner Control Room
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   OWNER PORTAL
   ========================================================= */

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

        if (!status.eligible) {
          window.location.href = "/staff";
          return;
        }

        setEligible(true);

        if (status.authenticated) {
          const ownerMe = await getOwnerMe();

          if (cancelled) return;

          if (ownerMe.ok && ownerMe.authenticated) {
            setOwnerData(ownerMe);
            setAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Unable to load Owner Security status:", error);

        if (!cancelled) {
          window.location.href = "/staff";
        }

        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOwnerStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="public-page">
        <div className="public-card">
          <span className="header-kicker">JET2 | PTFS</span>
          <h1>Checking Owner Security...</h1>
          <p>Verifying your Discord identity and Owner access.</p>

          <div className="dashboard-badge">
            <span className="status-dot"></span>
            Authenticating
          </div>
        </div>
      </main>
    );
  }

  if (!eligible) return null;

  if (!authenticated) {
    return (
      <OwnerLoginScreen
        onAuthenticated={async () => {
          try {
            const ownerMe = await getOwnerMe();

            if (ownerMe.ok && ownerMe.authenticated) {
              setOwnerData(ownerMe);
              setAuthenticated(true);
              return;
            }

            setAuthenticated(false);
          } catch (error) {
            console.error("Unable to load Owner session:", error);
          }
        }}
      />
    );
  }

  return <OwnerControlRoom ownerData={ownerData} onLogout={logoutOwner} />;
}

/* =========================================================
   AUTHENTICATED STAFF PORTAL
   ========================================================= */

function StaffPortal() {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const data = await getCurrentUser();

        if (cancelled) return;

        if (!data) {
          window.location.href = "/api/auth/discord";
          return;
        }

        setAuthData(data);
      } catch (error) {
        console.error("Unable to load staff authentication:", error);

        if (!cancelled) {
          window.location.href = "/api/auth/discord";
        }

        return;
      } finally {
        if (!cancelled) setLoading(false);
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
          <span className="header-kicker">JET2 | PTFS</span>
          <h1>Verifying staff access...</h1>
          <p>Checking your Discord account and Staff Portal permissions.</p>

          <div className="dashboard-badge">
            <span className="status-dot"></span>
            Authenticating
          </div>
        </div>
      </main>
    );
  }

  if (!authData) return null;

  return (
    <StaffLayout authData={authData}>
      <Routes>
        <Route index element={<StaffDashboard authData={authData} />} />
        <Route path="flights" element={<StaffFlights />} />
        <Route path="staff" element={<StaffMembers />} />
        <Route path="training" element={<StaffTraining />} />
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
        <Route path="/" element={<Home />} />
        <Route path="/staff/owner/*" element={<OwnerPortal />} />
        <Route path="/staff/*" element={<StaffPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
