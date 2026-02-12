import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "https://hospital-backend-olti.onrender.com/patients";

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
  const [popup, setPopup] = useState({ show: false, message: "" });

  useEffect(() => {
    if (isEdit) fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      setPatient(data);
    } catch (err) {
      showPopup("❌ Failed to load patient");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const showPopup = (message) => {
    setPopup({ show: true, message });
    setTimeout(() => setPopup({ show: false, message: "" }), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        // UPDATE
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patient),
        });
        showPopup("✅ Patient updated!");
      } else {
        // ADD
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patient),
        });
        showPopup("✅ Patient added!");
      }
      setTimeout(() => navigate("/"), 1200); // Navigate after popup
    } catch (err) {
      showPopup("❌ Operation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>{isEdit ? "Edit Patient" : "Add Patient"}</h2>

      <div className="card" style={{ maxWidth: "600px", margin: "10px auto" }}>
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
              {loading ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Patient" : "Save Patient")}
            </button>
          </div>
        </form>
      </div>

      {/* Centered popup */}
      {popup.show && <div className="popup">{popup.message}</div>}
    </div>
  );
}

export default AddPatient;
