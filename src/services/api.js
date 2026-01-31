// Update this with your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://hospital-backend-h25z.onrender.com/patients";

export const addPatient = async (patientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add patient: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
};

export const getPatients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`);

    if (!response.ok) {
      throw new Error(`Failed to fetch patients: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

export const getPatient = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch patient: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export const updatePatient = async (id, patientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update patient: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete patient: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
};
