import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPatient from "./pages/AddPatient";
import PatientList from "./pages/PatientList";

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