import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddPatient from "./pages/AddPatient";
import './styles/main.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
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

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    if(type !== "confirm") {
      setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2500);
    }
  };

  const confirmDelete = (id) => {
    setDeleteTarget(id);
    showPopup("Are you sure you want to delete this patient?", "confirm");
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
      <h2 style={{ textAlign: "center" }}>Patient List</h2>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
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
            {patients.map((p, i) => (
              <tr key={p.id} className="patient-row" style={{ animationDelay: `${i * 80}ms` }}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.doctor}</td>
                <td>{p.appointmentDate}</td>
                <td className="actions">
                  <Link to={`/edit/${p.id}`}>
                    <button className="btn edit">Update Patient</button>
                  </Link>
                  <button className="btn delete" onClick={() => confirmDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Centered Popup Modal */}
      {popup.show && (
        <div className="popup-container">
          <div className={`popup ${popup.type}`}>
            <p>{popup.message}</p>
            {popup.type === "confirm" && (
              <div className="popup-actions">
                <button className="btn edit" onClick={handleDelete}>Yes</button>
                <button className="btn delete" onClick={() => setPopup({ show: false, message: "", type: "" })}>No</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientList;
