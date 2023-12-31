import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./layouts/dashboard.tsx";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard/students" replace />} />
    </Routes>
  );
}

export default App;
