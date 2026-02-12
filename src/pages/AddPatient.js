import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // TEMP – backend illa, console la kaatum
    console.log("Patient Added:", patient);

    alert("✅ Patient added successfully!");
    navigate("/");
  };

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

export default AddPatient; //for PR process