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

  const user = authData?.user;
  const rank = authData?.rank;
  const positions = authData?.positions || [];

  const primaryDepartment =
    positions.length > 0
      ? positions[0].department
      : null;

  const primaryPosition =
    positions.length > 0
      ? positions[0].position
      : null;

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

          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user ? (
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
                    ?.toUpperCase() || "?"}
                </div>
              )}

              <div className="staff-user-info">
                <strong>
                  {user.username}
                </strong>

                {rank?.title ? (
                  <span>
                    {rank.title}
                  </span>
                ) : rank?.name ? (
                  <span>
                    {rank.name}
                  </span>
                ) : null}

                {primaryDepartment && (
                  <small>
                    {primaryPosition
                      ? `${primaryPosition} · ${primaryDepartment}`
                      : primaryDepartment}
                  </small>
                )}
              </div>
            </div>
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
          The public Jet2 | PTFS website is being built.
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
  const positions = authData?.positions || [];

  const departmentNames = positions
    .map(
      (position) =>
        position.department
    )
    .filter(
      (department, index, array) =>
        array.indexOf(department) === index
    );

  return (
    <div>
      <section className="welcome-section">
        <div>
          <span className="section-label">
            STAFF DASHBOARD
          </span>

          <h2>
            Hello{" "}
            {user?.username || "Staff Member"}!
          </h2>

          <p>
            Welcome to the Jet2 | PTFS Staff Portal.
            Manage flights, staff, training and airline
            operations from one place.
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
              Create and manage flights, hosts,
              schedules and boarding.
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
              Manage staff records, roles and
              operational access.
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
              Track training programmes, progress
              and certifications.
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
              Review and manage staff applications.
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
              {user?.username || "Verified"}
            </strong>
          </div>

          <div className="status-row">
            <span>
              Rank
            </span>

            <strong className="online-text">
              {rank?.title ||
                rank?.name ||
                "Staff"}
            </strong>
          </div>

          <div className="status-row">
            <span>
              Department
            </span>

            <strong className="online-text">
              {departmentNames.length > 0
                ? departmentNames.join(
                    " · "
                  )
                : "Leadership"}
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
        Flight creation, hosts, aircraft, boarding
        and operational controls will live here.
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
        Staff records, roles and permissions will
        live here.
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
        Training programmes, requirements and
        progress will live here.
      </p>
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
            Checking your Discord account and
            Staff Portal permissions.
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
