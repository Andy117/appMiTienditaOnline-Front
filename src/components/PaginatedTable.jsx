import React from 'react';
import { ChevronLeft, ChevronRight, Pencil, Power, Trash } from 'lucide-react';

const PaginatedTable = ({
    data,
    columns,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDeactivate,
    onDelete,
    keyID,
    onActivate
}) => {
    const formatValue = (value, accessor) => {
        if (accessor === 'estados_idEstados') {
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value === 2
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {value === 2 ? 'Activo' : 'Inactivo'}
                </span>
            );
        }
        return value;
    };

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.accessor}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item[keyID]} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td
                                        key={col.accessor}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                    >
                                        {formatValue(item[col.accessor], col.accessor)}
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="p-1 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        {item.estados_idEstados === 2 && (
                                            <button
                                                onClick={() => onDeactivate(item)}
                                                className="p-1 rounded-full hover:bg-orange-100 text-orange-600 hover:text-orange-700 transition-colors"
                                            >
                                                <Power className="h-4 w-4" />
                                            </button>
                                        )}
                                        {item.estados_idEstados === 1 && (
                                            <button
                                                onClick={() => onActivate(item)}
                                                className="p-1 rounded-full hover:bg-green-100 text-green-600 hover:text-green-700 transition-colors"
                                            >
                                                <Power className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(item)}
                                            disabled
                                            className="p-1 rounded-full hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Paginación */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg">
                        {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaginatedTable;