import { useContext, useEffect, useState } from "react";
import { AlertContext } from "@/Context/AlertContext";

const AlertBox = () => {
    const { alert } = useContext(AlertContext);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (alert.message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]); // Depend on alert to detect new alerts

    useEffect(() => {
        setIsVisible(!!alert.message); // Show if there is a message
    }, [alert.message]); // Depend on alert.message to detect new alerts

    if (!isVisible) return null;

    // Determine the color based on the type of alert
    const className = alert.type === "success" ? "bg-green-100 border-green-700 text-green-700" : "bg-red-100 border-red-500 text-red-700";

    return (
        <div
            className={`fixed top-5 right-5 z-50 p-4 border-l-4 rounded-md shadow-md ${className}`}
            role="alert"
        >
            <strong className="font-bold">{alert.type}!</strong>
            <span className="block sm:inline"> {alert.message}</span>
        </div>
    );
};

export default AlertBox;
