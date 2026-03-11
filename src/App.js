import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPatient from "./pages/AddPatient";
import './styles/main.css';

function Notification({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

function DeleteConfirm({ visible, onConfirm, onCancel }) {
  if (!visible) return null;
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p>Are you sure you want to delete this patient?</p>
        <div style={{ marginTop: "10px" }}>
          <button className="btn edit" onClick={onConfirm}>Yes</button>
          <button className="btn delete" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [notification, setNotification] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    try {
      await fetch(`https://hospital-backend-olti.onrender.com/patients/${id}`, {
        method: "DELETE",
      });
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setDeleteTarget(null);
      setNotification("✅ Patient deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteTarget(null);
      setNotification("❌ Failed to delete patient");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>Patient List</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/add">
          <button className="btn edit">Add Patient</button>
        </Link>
      </div>

      <div className="table-wrap">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Doctor</th>
              <th>Appointment</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => {
              const appt = p.appointmentDate
                ? new Date(p.appointmentDate).toLocaleDateString()
                : "-";
              return (
                <tr key={p.id} className="patient-row" style={{ animationDelay: `${i * 80}ms` }}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.doctor}</td>
                  <td>{appt}</td>
                  <td className="actions">
                    <button className="btn edit" onClick={() => navigate(`/edit/${p.id}`)}>Edit</button>
                    <button className="btn delete" onClick={() => setDeleteTarget(p.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DeleteConfirm
        visible={deleteTarget !== null}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <Notification
        message={notification}
        onClose={() => setNotification("")}
      />
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
