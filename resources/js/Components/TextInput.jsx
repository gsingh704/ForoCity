import React, { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({
    type = 'text',
    className = '',
    isFocused = false,
    value,
    onChange,
    ...props
}, ref) {
    const inputRef = ref || useRef();

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    // Update the internal state on change
    const handleChange = (e) => {
        onChange(e);
    };

    return (
        <input
            {...props}
            type={type}
            className={`overflow-y-auto border-gray-300 focus:border-blue-900 focus:ring-blue-900 rounded-md shadow-sm ${className}`}
            ref={inputRef}
            value={value}
            onChange={handleChange}
        />
    );
});
