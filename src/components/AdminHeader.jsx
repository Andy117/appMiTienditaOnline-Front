import React from "react"
import { LogOut, LayoutGrid, Package, Tags, Building2, Ruler, Users, UserCircle, House } from 'lucide-react'
import { useNavigate } from "react-router-dom"

const AdminHeader = ({ h1, span }) => {
    const navigate = useNavigate()
    const navigationItems = [
        { name: 'Inicio', icon: House },
        { name: 'Productos', icon: Package },
        { name: 'Categorias', icon: LayoutGrid },
        { name: 'Marcas', icon: Tags },
        { name: 'UnidadesMedida', icon: Ruler },
        { name: 'Presentaciones', icon: Building2 },
        { name: 'Clientes', icon: Users },
        { name: 'Usuarios', icon: UserCircle }
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    return (

        <div>
            < div className="flex justify-between items-center mb-8" >
                <h1 className="text-3xl font-bold text-gray-800">
                    {h1}
                    <span className="block text-sm font-normal text-gray-500 mt-1">
                        {span}
                    </span>
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                </button>
            </div >
            < div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8" >
                {
                    navigationItems.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => navigate(`/${name.toLowerCase()}`)}
                            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <Icon className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">{name}</span>
                        </button>
                    ))
                }
            </div >
        </div>
    )
}

export default AdminHeader