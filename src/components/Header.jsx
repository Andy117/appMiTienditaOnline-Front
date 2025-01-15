import { LogOut } from "lucide-react"
import React from "react"

const Header = ({ title, subtitle, actions = [], onLogOut }) => {
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">{title}
                    {subtitle && (
                        <span className="block text-sm font-normal text-gray-500 mt-1">
                            {subtitle}
                        </span>
                    )}
                </h1>
                <button
                    onClick={onLogOut}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                </button>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                {actions.map(({ label, onClick, icon: Icon, color = 'white' }) => (
                    <button
                        key={label}
                        onClick={onClick}
                        className={`flex flex-col items-center gap-2 p-4 bg-white bg-${color}-500 text-blue-600 rounded-lg hover:bg-${color}-600 rounded-lg shadow-sm hover:shadow-md transition-shadow border`}
                    >
                        {Icon && <Icon className='w-6 h-6 text-blue-600' />}
                        {label && (
                            <span className="text-sm font-medium text-gray-700">
                                {label}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Header