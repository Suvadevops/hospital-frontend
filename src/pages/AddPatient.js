import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddPatient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    doctor: "",
    appointmentDate: ""
  });

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
      const response = await fetch(
        "https://hospital-backend-olti.onrender.com/patients",  // 🔥 Replace this
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(patient)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save patient");
      }

      alert("✅ Patient added successfully!");
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("❌ Error saving patient. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>{isEdit ? "Update Patient" : "Add Patient"}</h1>

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
              {loading ? "Saving..." : "Save Patient"}
            </button>
          </div>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddPatient;
