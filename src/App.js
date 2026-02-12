import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPatient from "./pages/AddPatient";

function PatientList() {
  return (
    <div className="container">
      <h1>Patient List</h1>
      <p style={{ textAlign: "center", opacity: 0.8 }}>
        (Temporary page – backend connect panna list varum)
      </p>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <a href="/add">
          <button>Add Patient</button>
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/add" element={<AddPatient />} />
        <Route path="/edit/:id" element={<AddPatient />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;