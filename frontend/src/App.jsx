import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Role from "./pages/Role"; 
import AccessMatrix from "./pages/AccessMatrix";
import GenerateRequest from "./pages/GenerateRequest";
import RevokeRequest from "./pages/RevokeRequest";
import RequestHistory from "./pages/RequestHistory";
function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/roles" element={<Role />} /> 
          <Route path="/access-matrix" element={<AccessMatrix />} />
          <Route path="/requests" element={<GenerateRequest />} />
          <Route path="/revoke" element={<RevokeRequest />} />
          <Route path="/history" element={<RequestHistory />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;