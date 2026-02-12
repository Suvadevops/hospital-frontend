import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await fetch(`https://hospital-backend-olti.onrender.com/patients/${id}`, {
        method: "DELETE",
      });
      fetchPatients();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="page">
      <h1 className="title">Patient Management</h1>

      <div className="card">
        {patients.length === 0 ? (
          <p className="empty">No patients found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Doctor</th>
                <th>Appointment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.doctor}</td>
                  <td>{p.appointmentDate}</td>
                  <td>
                    <Link to={`/edit/${p.id}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => deletePatient(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="add-btn-container">
          <Link to="/add">
            <button className="add-btn">+ Add Patient</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientList;
