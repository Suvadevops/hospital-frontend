import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPatient from "./pages/AddPatient";
import './styles/main.css';

function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("https://hospital-backend-olti.onrender.com/patients");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  return (
    <div className="container">
      <h1>Patient List</h1>

      {patients.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.8 }}>
          No patients found.
        </p>
      ) : (
        <ul>
          {patients.map((p) => (
            <li key={p.id}>
              {p.name} - {p.age} - {p.doctor}
            </li>
          ))}
        </ul>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link to="/add">
          <button>Add Patient</button>
        </Link>
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
