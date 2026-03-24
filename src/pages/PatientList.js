import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './styles/main.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchDoctor, setSearchDoctor] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  // 📅 SORT BY DATE
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const dateA = new Date(a.appointmentDate || 0);
    const dateB = new Date(b.appointmentDate || 0);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    if (type !== "confirm") {
      setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
    }
  };

  const confirmDelete = (id) => {
    setDeleteTarget(id);
    showPopup("⚠️ Are you sure you want to delete this patient?", "confirm");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`https://hospital-backend-olti.onrender.com/patients/${deleteTarget}`, {
        method: "DELETE",
      });
      setPatients(prev => prev.filter(p => p.id !== deleteTarget));
      showPopup("✅ Patient deleted successfully!");
      setDeleteTarget(null);
    } catch (error) {
      showPopup("❌ Delete failed", "error");
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
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          className="btn edit"
          onClick={() => setSortAsc(!sortAsc)}
        >
          📅 Sort by Date {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {/* 🔥 ACTION + COUNT SECTION */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        flexWrap: "wrap",
        gap: "10px"
      }}>

        {/* ➕ ADD + CLEAR */}
        <div>
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
        </div>

        {/* 👨‍⚕️ COUNT BOX */}
        <div style={{
          background: "rgba(255,255,255,0.08)",
          padding: "12px 20px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 0 15px rgba(0,255,255,0.2)",
          fontWeight: "600"
        }}>
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

                // 🔥 COLOR LOGIC
                let rowStyle = {};
                const today = new Date();

                if (apptDate) {
                  if (apptDate.toDateString() === today.toDateString()) {
                    rowStyle = { background: "rgba(0,255,0,0.15)" }; // today
                  } else if (apptDate < today) {
                    rowStyle = { background: "rgba(255,0,0,0.15)" }; // past
                  } else {
                    rowStyle = { background: "rgba(0,150,255,0.15)" }; // upcoming
                  }
                }

                return (
                  <tr key={p.id} className="patient-row" style={rowStyle}>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.doctor}</td>
                    <td>{appt}</td>
                    <td>
                      <Link to={`/edit/${p.id}`}>
                        <button className="btn edit">✏️ Edit</button>
                      </Link>
                      <button
                        className="btn delete"
                        onClick={() => confirmDelete(p.id)}
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

      {/* ⚠️ POPUP */}
      {popup.show && (
        <div className="popup-container">
          <div className={`popup ${popup.type}`}>
            <p>{popup.message}</p>
            {popup.type === "confirm" && (
              <div style={{ marginTop: "10px" }}>
                <button className="btn edit" onClick={handleDelete}>Yes</button>
                <button
                  className="btn delete"
                  onClick={() => setPopup({ show: false, message: "", type: "" })}
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default PatientList;