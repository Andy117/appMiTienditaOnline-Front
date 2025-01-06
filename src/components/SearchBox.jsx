import React from 'react';

const SearchBox = ({ onSearch }) => {
    const handleSearch = (e) => {
        onSearch(e.target.value);
    }

    return (
        <input
            type="text"
            placeholder="Buscar productos..."
            onChange={handleSearch}
            className="px-4 py-2 border rounded-lg w-full md:w-1/3"
        />
    )
}

export default SearchBox
