import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>Jet2 | PTFS</h1>
      <p>Welcome aboard.</p>

      <Link to="/staff">Staff Portal</Link>
    </main>
  );
}

function Staff() {
  return (
    <main>
      <h1>Staff Portal</h1>
      <p>Jet2 | PTFS staff access.</p>

      <nav>
        <Link to="/staff">Dashboard</Link>
        {" | "}
        <Link to="/staff/flights">Flights</Link>
        {" | "}
        <Link to="/staff/staff">Staff</Link>
        {" | "}
        <Link to="/staff/training">Training</Link>
      </nav>
    </main>
  );
}

function StaffFlights() {
  return (
    <main>
      <h1>Flight Management</h1>
      <p>Flight management tools will appear here.</p>
    </main>
  );
}

function StaffMembers() {
  return (
    <main>
      <h1>Staff Management</h1>
      <p>Staff management tools will appear here.</p>
    </main>
  );
}

function StaffTraining() {
  return (
    <main>
      <h1>Training</h1>
      <p>Training management tools will appear here.</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/flights" element={<StaffFlights />} />
        <Route path="/staff/staff" element={<StaffMembers />} />
        <Route path="/staff/training" element={<StaffTraining />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
