import React from "react";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    // Function to generate an array of page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex flex-wrap justify-center mt-2">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1} // Disable if on the first page
                className={`mr-1 mb-1 px-4 py-3  leading-4 border rounded ${
                    currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "focus:border-primary focus:text-primary bg-white text-gray-700 hover:bg-blue-900 hover:text-white"
                }`}
                aria-label="Previous"
            >
                <GrLinkPrevious />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`mr-1 mb-1 px-4 py-3  leading-4 border rounded ${
                        currentPage === number
                            ? "bg-blue-900 text-white"
                            : "focus:border-primary focus:text-primary bg-white text-gray-700 hover:bg-blue-900 hover:text-white"
                    }`}
                    aria-label={`Page ${number}`}
                >
                    {number}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages} // Disable if on the last page
                className={`mr-1 mb-1 px-4 py-3  leading-4 border rounded ${
                    currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "focus:border-primary focus:text-primary bg-white text-gray-700 hover:bg-blue-900 hover:text-white"
                }`}
                aria-label="Next"
            >
                <GrLinkNext />
            </button>
        </div>
    );
}
