import React from "react";

/**
 * ToggleButton component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isActive - Indicates whether the button is active or not.
 * @param {function} props.onClick - The function to be called when the button is clicked.
 * @param {React.Component} props.icon - The icon component to be rendered.
 * @param {string} props.label - The label text for the button.
 * @param {boolean} [props.isLast=false] - Indicates whether the button is the last one in a group.
 * @param {string} [props.className=""] - Additional CSS class names for the button.
 * @returns {JSX.Element} The rendered ToggleButton component.
 */
const ToggleButton = ({
    isActive,
    onClick,
    icon: Icon,
    label,
    isLast = false,
    className = "",
}) => {
    return (
        <button
            className={`p-2 font-semibold flex items-center gap-2 overflow-hidden hover:bg-blue-200 transition-colors duration-300 hover:text-blue-800 focus:outline-none
            ${isActive ? "bg-blue-900 text-white" : ""}
            ${isLast ? "" : "border-r border-gray-300"} ${className}`}
            onClick={onClick}
        >
            {Icon && <Icon className="text-2xl" />}
            {label}
        </button>
    );
};

export default ToggleButton;
