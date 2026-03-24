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
        <p>⚠️ Are you sure you want to delete this patient?</p>
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
  const [searchDoctor, setSearchDoctor] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
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

  // 🔍 FILTER
  const filteredPatients = patients.filter((p) =>
    (p.doctor || "").toLowerCase().includes(searchDoctor.toLowerCase())
  );

  // 📅 SAFE SORT BY DATE
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const dateA = a.appointmentDate ? new Date(a.appointmentDate) : new Date(0);
    const dateB = b.appointmentDate ? new Date(b.appointmentDate) : new Date(0);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

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

      {/* 🏥 TITLE */}
      <h2>🏥 Patient Management Dashboard</h2>

      {/* 🔍 SEARCH */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="🔍 Search by Doctor Name..."
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
        />
      </div>

      {/* 📅 SORT BUTTON */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <button
          className="btn edit"
          onClick={() => setSortAsc(!sortAsc)}
        >
          📅 Sort by Date {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {/* 🔘 ACTIONS */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/add">
          <button className="btn edit">➕ Add Patient</button>
        </Link>

        <button
          className="btn delete"
          style={{ marginLeft: "10px" }}
          onClick={() => setSearchDoctor("")}
        >
          ❌ Clear
        </button>

        {/* 👨‍⚕️ COUNT */}
        <div className="count-box">
          👨‍⚕️ Total Patients: {sortedPatients.length}
        </div>
      </div>

      {/* 📋 TABLE */}
      <div className="table-wrap">
        <table className="patients-table">
          <thead>
            <tr>
              <th>👤 Name</th>
              <th>🎂 Age</th>
              <th>🩺 Doctor</th>
              <th>📅 Appointment</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients.length > 0 ? (
              sortedPatients.map((p) => {

                const apptDate = p.appointmentDate
                  ? new Date(p.appointmentDate)
                  : null;

                const appt = apptDate
                  ? apptDate.toLocaleDateString()
                  : "-";

                // 🎨 ROW COLOR LOGIC
                let rowStyle = {};
                const today = new Date();

                if (apptDate) {
                  if (apptDate.toDateString() === today.toDateString()) {
                    rowStyle = { background: "rgba(0,255,0,0.15)" }; // 🟢 today
                  } else if (apptDate < today) {
                    rowStyle = { background: "rgba(255,0,0,0.15)" }; // 🔴 past
                  } else {
                    rowStyle = { background: "rgba(0,150,255,0.15)" }; // 🔵 upcoming
                  }
                }

                return (
                  <tr key={p.id} className="patient-row" style={rowStyle}>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.doctor}</td>
                    <td>{appt}</td>
                    <td>
                      <button
                        className="btn edit"
                        onClick={() => navigate(`/edit/${p.id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn delete"
                        onClick={() => setDeleteTarget(p.id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  😶 No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ⚠️ DELETE CONFIRM */}
      <DeleteConfirm
        visible={deleteTarget !== null}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* 🔔 NOTIFICATION */}
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