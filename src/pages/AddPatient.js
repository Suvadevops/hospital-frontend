import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addPatient, getPatient, updatePatient } from "../services/api";

function AddPatient() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    doctor: "",
    appointmentDate: ""
  });

  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await updatePatient(id, patient);
        alert("✅ Patient updated successfully!");
      } else {
        await addPatient(patient);
        alert("✅ Patient added successfully!");
      }
      setPatient({
        name: "",
        age: "",
        doctor: "",
        appointmentDate: ""
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to add patient");
      alert("❌ " + (err.message || "Failed to add patient"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (isEdit) {
      (async () => {
        try {
          const data = await getPatient(id);
          if (!mounted) return;
          let appt = "";
          if (data.appointmentDate) {
            try {
              appt = new Date(data.appointmentDate).toISOString().slice(0, 10);
            } catch (e) {
              appt = data.appointmentDate;
            }
          }
          setPatient({
            name: data.name || "",
            age: data.age || "",
            doctor: data.doctor || "",
            appointmentDate: appt
          });
        } catch (err) {
          setError(err.message || "Failed to load patient");
        }
      })();
    }
    return () => (mounted = false);
  }, [id, isEdit]);

  return (
    <div className="container">
      <h1>Add Patient</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            required
            onChange={handleChange}
            value={patient.name}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            required
            onChange={handleChange}
            value={patient.age}
          />

          <input
            type="text"
            name="doctor"
            placeholder="Doctor Name"
            required
            onChange={handleChange}
            value={patient.doctor}
          />

          <input
            type="date"
            name="appointmentDate"
            required
            onChange={handleChange}
            value={patient.appointmentDate}
          />

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button type="submit" disabled={loading}>
              {loading ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update Patient" : "Save Patient"}
            </button>
          </div>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        </form>
      </div>
    </div>
  );
}

export default AddPatient;