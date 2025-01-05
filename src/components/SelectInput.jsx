import React from "react"

const SelectInput = ({ label, id, name, value, onChange, options, error }) => {
    return (
        <div>
            <label htmlFor={id}>
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Seleccione una opción</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}

export default SelectInput