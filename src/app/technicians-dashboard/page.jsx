"use client";
import { useAuth } from "@/context/AuthContext";
import Nav2 from "@/component/Nav2";
import Dashboard from "@/component/dashboard";
import TechnicianSettings from "@/component/Settings";
const App = () => {
  const { currentPage } = useAuth();
  return (
    <div
      className="w-full leading-normal tracking-normal"
      style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
    >
      <Nav2 />
       {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "settings" && <TechnicianSettings />}
      
    </div>
  );

};

export default App;
