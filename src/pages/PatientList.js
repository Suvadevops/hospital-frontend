import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPatients, deletePatient } from "../services/api";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        if (mounted) setPatients(data);
      } catch (err) {
        setError(err.message || "Failed to load patients");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPatients();
    return () => (mounted = false);
  }, []);

  return (
    <div className="container">
      <h1>Patient List</h1>

      {loading && <p>Loading patients…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div>
          {patients.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.8 }}>No patients yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Doctor</th>
                    <th>Appointment</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => {
                    const appt = p.appointmentDate
                      ? new Date(p.appointmentDate).toLocaleDateString()
                      : "-";
                    return (
                      <tr
                        key={p.id}
                        className="patient-row"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <td>{p.name}</td>
                        <td>{p.age}</td>
                        <td>{p.doctor}</td>
                        <td>{appt}</td>
                        <td className="actions">
                          <button
                            className="btn edit"
                            onClick={() => navigate(`/edit/${p.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn delete"
                            onClick={async () => {
                              if (window.confirm("Delete this patient?")) {
                                try {
                                  await deletePatient(p.id);
                                  setPatients((prev) => prev.filter((x) => x.id !== p.id));
                                } catch (err) {
                                  alert(err.message || "Delete failed");
                                }
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Link to="/add">
              <button>Add Patient</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientList;
