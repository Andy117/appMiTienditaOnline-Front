import React from 'react'

const CategoryFilter = ({ onFilter }) => {
    const categories = ['Todas', 'Bebidas', 'Alimentos', 'Snacks']

    return (
        <div className="flex gap-4">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onFilter(category)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                    {category}
                </button>
            ))}
        </div>
    )
}

export default CategoryFilter
