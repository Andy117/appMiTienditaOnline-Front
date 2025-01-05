import React from 'react'

const TextAreaInput = ({ label, id, name, rows = '3', value, onChange, error }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                id={id}
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder='Ingresa la descripcion del producto que estes agregando'
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}

export default TextAreaInput