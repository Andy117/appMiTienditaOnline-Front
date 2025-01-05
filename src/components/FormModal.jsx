import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const FormModal = ({ isOpen, onClose, onSubmit, formik, fields, title, type, disabled, txtBtn }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="p-4">
                    <div className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label
                                    htmlFor={field.name}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    {field.label}
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type || 'text' || type}
                                    disabled={disabled}
                                    value={formik.values[field.name]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${formik.errors[field.name] && formik.touched[field.name]
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                        }
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    disabled:bg-gray-50 disabled:text-gray-500
                    transition-colors duration-200
                  `}
                                />
                                {formik.errors[field.name] && formik.touched[field.name] && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors[field.name]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {txtBtn}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormModal;