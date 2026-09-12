```jsx
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
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

function StaffLayout({ children, authData }) {
  const location = useLocation();

  const navigation = [
    { label: "Dashboard", path: "/staff" },
    { label: "Flights", path: "/staff/flights" },
    { label: "Staff", path: "/staff/staff" },
    { label: "Training", path: "/staff/training" },
  ];

  const user = authData?.user || {};
  const rank = authData?.rank || {};
  const departments = authData?.departments || [];

  const primaryPosition =
    departments.length > 0 ? departments[0]?.position : null;

  const primaryDepartment =
    departments.length > 0 ? departments[0]?.department : null;

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
          <div className="staff-user">
            {user.avatarUrl ? (
              <img
                className="staff-avatar"
                src={user.avatarUrl}
                alt={`${user.username || "Discord"} avatar`}
              />
            ) : (
              <div className="staff-avatar-placeholder">
                {(user.username || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="staff-user-info">
              <strong>{user.username || "Discord User"}</strong>

              <small>
                {primaryPosition
                  ? `${primaryPosition} · ${primaryDepartment}`
                  : primaryDepartment || rank.name || "Staff"}
              </small>
            </div>
          </div>

          <span>Staff access</span>
          <small>Discord verification active</small>
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

function Home() {
  return (
    <main className="public-page">
      <div className="public-card">
        <span className="header-kicker">JET2 | PTFS</span>

        <h1>Welcome aboard.</h1>

        <p>
          The public Jet2 | PTFS website is being built.
        </p>

        <Link className="primary-button" to="/staff">
          Open Staff Portal
        </Link>
      </div>
    </main>
  );
}

function StaffDashboard({ authData }) {
  const user = authData?.user || {};
  const rank = authData?.rank || {};
  const departments = authData?.departments || [];

  const primaryDepartment =
    departments.length > 0 ? departments[0]?.department : "Staff";

  return (
    <div>
      <section className="welcome-section">
        <div>
          <span className="section-label">STAFF DASHBOARD</span>

          <h2>
            Hello {user.username || "Staff Member"}!
          </h2>

          <p>
            Welcome to the Jet2 | PTFS Staff Portal. Manage flights,
            staff, training and airline operations from one place.
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

            <p>
              Create and manage flights, hosts, schedules and boarding.
            </p>
          </div>

          <span className="card-arrow">→</span>
        </Link>

        <Link to="/staff/staff" className="dashboard-card">
          <span className="card-icon">◉</span>

          <div>
            <h3>Staff Management</h3>

            <p>
              Manage staff records, roles and operational access.
            </p>
          </div>

          <span className="card-arrow">→</span>
        </Link>

        <Link to="/staff/training" className="dashboard-card">
          <span className="card-icon">✓</span>

          <div>
            <h3>Training</h3>

            <p>
              Track training programmes, progress and certifications.
            </p>
          </div>

          <span className="card-arrow">→</span>
        </Link>

        <div className="dashboard-card disabled-card">
          <span className="card-icon">▣</span>

          <div>
            <h3>Applications</h3>

            <p>
              Review and manage staff applications.
            </p>
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
            <strong>{user.username || "Verified"}</strong>
          </div>

          <div className="status-row">
            <span>Rank</span>
            <strong>
              {rank.title || rank.name || "Staff"}
            </strong>
          </div>

          <div className="status-row">
            <span>Department</span>
            <strong>{primaryDepartment}</strong>
          </div>

          <div className="status-row">
            <span>Portal access</span>
            <strong className="online-text">
              Authorized
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="section-label">SYSTEM</span>
            <h3>Portal status</h3>
          </div>
        </div>

        <div className="status-list">
          <div className="status-row">
            <span>D1 Database</span>
            <strong className="online-text">
              Connected
            </strong>
          </div>

          <div className="status-row">
            <span>Discord integration</span>
            <strong className="online-text">
              Connected
            </strong>
          </div>

          <div className="status-row">
            <span>Staff permissions</span>
            <strong className="online-text">
              Active
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

function StaffFlights() {
  return (
    <div className="placeholder-page">
      <span className="section-label">
        FLIGHT OPERATIONS
      </span>

      <h2>Flight Management</h2>

      <p>
        Flight creation, hosts, aircraft, boarding and
        operational controls will live here.
      </p>
    </div>
  );
}

function StaffMembers() {
  return (
    <div className="placeholder-page">
      <span className="section-label">STAFF</span>

      <h2>Staff Management</h2>

      <p>
        Staff records, roles and permissions will live here.
      </p>
    </div>
  );
}

function StaffTraining() {
  return (
    <div className="placeholder-page">
      <span className="section-label">TRAINING</span>

      <h2>Training</h2>

      <p>
        Training programmes, requirements and progress will
        live here.
      </p>
    </div>
  );
}

function StaffPortal() {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verifyAuthentication() {
      try {
        const data = await getCurrentUser();

        if (!mounted) {
          return;
        }

        if (!data) {
          window.location.href = "/api/auth/discord";
          return;
        }

        setAuthData(data);
      } catch (error) {
        console.error(
          "Staff authentication check failed:",
          error
        );

        if (mounted) {
          window.location.href = "/api/auth/discord";
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    verifyAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="public-page">
        <div className="public-card">
          <span className="header-kicker">
            JET2 | PTFS
          </span>

          <h1>Verifying staff access...</h1>

          <p>
            Checking your Discord membership, roles and
            portal permissions.
          </p>
        </div>
      </main>
    );
  }

  if (!authData) {
    return null;
  }

  return (
    <StaffLayout authData={authData}>
      <Routes>
        <Route
          index
          element={
            <StaffDashboard authData={authData} />
          }
        />

        <Route
          path="flights"
          element={<StaffFlights />}
        />

        <Route
          path="staff"
          element={<StaffMembers />}
        />

        <Route
          path="training"
          element={<StaffTraining />}
        />
      </Routes>
    </StaffLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/staff/*"
          element={<StaffPortal />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
