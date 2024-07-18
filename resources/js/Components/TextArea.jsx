import React, { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextArea(
    { className = "", isFocused = false, onChange, value, ...props },
    ref
) {
    const inputRef = ref || useRef();

    useEffect(() => {
        if (isFocused) {
            const length = inputRef.current.value.length;
            inputRef.current.focus();
            inputRef.current.setSelectionRange(length, length);
        }
    }, [isFocused, inputRef]);

    // Update the internal state on change
    const handleChange = (e) => {
        onChange(e);
    };

    return (
        <textarea
            {...props}
            value={value}
            onChange={handleChange}
            className={
                "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" +
                className
            }
            ref={inputRef}
        />
    );
});
