import React from "react";

const LoginFirst = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Please Log In</h2>
                <p>You need to be logged in to perform this action.</p>
                <div className="mt-4">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">
                        Close
                    </button>
                    <a href="/login" className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Log In
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginFirst;
