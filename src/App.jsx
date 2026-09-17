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
    VCHM: "Vice Chairman",
    CEO: "Chief Executive Officer",
    COO: "Chief Operating Officer",

    CDO: "Chief Development Officer",
    CTO: "Chief Technology Officer",
    CHRO: "Chief Human Resources Officer",
    CAO: "Chief Administrative Officer",
    CMO: "Chief Marketing Officer",
    COM: "Chief Operations Manager",
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
          ›
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
    window.location.href = "/";
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
      path: "/staff/owner/organization"
    });
  }

  const user = authData?.user;
  const rank = authData?.rank;
  const positions =
    authData?.positions || [];

  const permissions =
    authData?.permissions || {};

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
                        " · "
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
                              ✓
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
                  ↪
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
          Open Staff Portal
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
            ✈
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
            →
          </span>
        </Link>

        <Link
          to="/staff/staff"
          className="dashboard-card"
        >
          <span className="card-icon">
            ◉
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
            →
          </span>
        </Link>

        <Link
          to="/staff/training"
          className="dashboard-card"
        >
          <span className="card-icon">
            ✓
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
            →
          </span>
        </Link>

        <div className="dashboard-card disabled-card">
          <span className="card-icon">
            ▣
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
                    " · "
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
            {busy ? "Verifying…" : "Enter Administration"}
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
          Custom photo URL <span style={{ fontWeight: 500, color: "#777" }}>(optional — Discord avatar is used by default)</span>
          <input type="url" value={form.customPhotoUrl} onChange={(event) => update("customPhotoUrl", event.target.value)} style={formInputStyle} placeholder="https://…" />
        </label>

        {error && <div style={errorStyle}>{error}</div>}

        <button type="submit" disabled={busy} style={{ ...primaryButtonStyle, width: "fit-content" }}>
          {busy ? "Saving…" : form.id ? "Save Changes" : "Add Person"}
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
    return <div style={ownerCardStyle}>Checking owner security…</div>;
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
          <p style={{ color: "#777", marginTop: 24 }}>Loading organization records…</p>
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
          path="owner/organization"
          element={
            <OwnerOrganization />
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
          element={<Home />}
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
