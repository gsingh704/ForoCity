import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchButton({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [searchMessage, setSearchMessage] = useState("");

    // Handle search input changes
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Toggle input visibility
    const toggleInput = () => {
        if (!showInput) setSearchMessage(""); // Reset search message when showing input
        setShowInput(!showInput);
    };

    // Trigger the search, set the message, and hide the input
    const search = () => {
        if (searchQuery.trim() !== "") {
            onSearch(searchQuery);
            setSearchMessage(searchQuery);
            setSearchQuery(""); // Optional: Clear the search query after search
        }
        setShowInput(false);
    };

    return (
        <div className="border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-row">
            {showInput && (
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full rounded-l-lg border-r"
                    //enter button submits the search
                    onKeyDown={(e) => {
                        if (e.key === "Enter") search();
                    }}
                />
            )}
            {!showInput && searchMessage && (
                <div className="mr-2 self-center text-lg text-gray-600">
                    <span>
                        You searched for:{" "}
                        <span className="font-bold">{searchMessage}</span>
                    </span>
                </div>
            )}
            <button
                onClick={showInput ? search : toggleInput}
                className="bg-blue-900 hover:bg-blue-950 text-white font-bold p-3 rounded-r-lg shadow-lg"
                aria-label="Search"
            >
                <FaSearch />
            </button>
        </div>
    );
}
