import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });

    // Hide alert after 3 seconds (3000 ms)
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const dismissAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ alert, showAlert, dismissAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
