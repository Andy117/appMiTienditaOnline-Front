import React from "react"

const TextInput = ({ label, id, name, type = 'text', placeholder, min, value, onChange, error, disabled = false }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} <span className="text-red-500">*</span>
            </label>
            <input
                id={id}
                name={name}
                type={type}
                min={min}
                disabled={disabled}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}

export default TextInput