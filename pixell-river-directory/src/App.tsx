import "./styles.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import EmployeesPage from "./pages/EmployeesPage";
import OrganizationPage from "./pages/OrganizationPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
      </Routes>
      <Footer />
    </>
  );
}