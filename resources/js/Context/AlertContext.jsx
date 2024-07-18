// AlertContext.js
import React, { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ type: "", message: "" });

    const showAlert = (type, message) => {
        setAlert({ key: Date.now(), type, message });
        // Automatically hide the alert after 5 seconds and then reset the alert
        setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
