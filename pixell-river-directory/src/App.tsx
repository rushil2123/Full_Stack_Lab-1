import "./styles.css";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DepartmentCard from "./components/DepartmentCard";
import employees from "./data/employees.json";
import type { DepartmentGroup } from "./types";
import { Routes, Route, Navigate } from "react-router-dom";

function Directory() {
  const data = (employees as DepartmentGroup[]) ?? [];

  return (
    <main id="main-content">
      <Header />
      <section aria-labelledby="directory-heading" className="directory">
        <h2 id="directory-heading" className="sr-only">Departments and employees</h2>
        {data.map(group => (
          <DepartmentCard
            key={group.department}
            department={group.department}
            employees={group.employees}
          />
        ))}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
      </Routes>
      <Directory />
      <Footer />
    </>
  );
}