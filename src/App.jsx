import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

function StaffLayout({ children }) {
  const location = useLocation();

  const navigation = [
    { label: "Dashboard", path: "/staff" },
    { label: "Flights", path: "/staff/flights" },
    { label: "Staff", path: "/staff/staff" },
    { label: "Training", path: "/staff/training" },
  ];

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
          <span>Staff access</span>
          <small>Discord verification required</small>
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

function StaffDashboard() {
  return (
    <div>
      <section className="welcome-section">
        <div>
          <span className="section-label">STAFF DASHBOARD</span>
          <h2>Welcome to Jet2 | PTFS</h2>
          <p>
            Manage flights, staff, training and airline operations from one
            place.
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
            <span className="section-label">SYSTEM</span>
            <h3>Portal status</h3>
          </div>
        </div>

        <div className="status-list">
          <div className="status-row">
            <span>D1 Database</span>
            <strong className="online-text">Connected</strong>
          </div>

          <div className="status-row">
            <span>Discord integration</span>
            <strong className="pending-text">Authentication pending</strong>
          </div>

          <div className="status-row">
            <span>Staff permissions</span>
            <strong className="pending-text">Configuration pending</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

function StaffFlights() {
  return (
    <div className="placeholder-page">
      <span className="section-label">FLIGHT OPERATIONS</span>
      <h2>Flight Management</h2>
      <p>
        Flight creation, hosts, aircraft, boarding and operational controls
        will live here.
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
        Training programmes, requirements and progress will live here.
      </p>
    </div>
  );
}

function StaffPortal() {
  return (
    <StaffLayout>
      <Routes>
        <Route index element={<StaffDashboard />} />
        <Route path="flights" element={<StaffFlights />} />
        <Route path="staff" element={<StaffMembers />} />
        <Route path="training" element={<StaffTraining />} />
      </Routes>
    </StaffLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff/*" element={<StaffPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
