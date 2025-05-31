"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const ServiceContext = createContext([]);

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const res = await fetch(`/api/services?ts=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      setServices(data || []);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider value={{ services, loading }}>
      {children}
    </ServiceContext.Provider>
  );
};