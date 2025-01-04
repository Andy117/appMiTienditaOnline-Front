import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogOut, Eye, LayoutGrid, Package, Tags, Building2, Ruler, Users, UserCircle } from 'lucide-react'

const OperatorDashboard = () => {
    const [orders, setOrders] = useState([])
    const navigate = useNavigate()

    const navigationItems = [
        { name: 'Productos', icon: Package },
        { name: 'Categorias', icon: LayoutGrid },
        { name: 'Marcas', icon: Tags },
        { name: 'Unidades de Medida', icon: Ruler },
        { name: 'Presentaciones', icon: Building2 },
        { name: 'Clientes', icon: Users },
        { name: 'Usuarios', icon: UserCircle }
    ]

    const getStatusColor = (status) => {
        const statusColors = {
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'Aprobado': 'bg-green-100 text-green-800',
            'Rechazado': 'bg-red-100 text-red-800',
            'En Proceso': 'bg-blue-100 text-blue-800',
            'Enviado': 'bg-purple-100 text-purple-800',
            'Entregado': 'bg-emerald-100 text-emerald-800',
            'Cancelado': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    }

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost:1234/api/orders', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setOrders(response.data.data)
            } catch (error) {
                console.error('Error al obtener las ordenes', error)
            }
        }
        fetchOrders()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const handleViewOrder = (orderId) => {
        navigate(`/orders/${orderId}`)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Panel de Control
                        <span className="block text-sm font-normal text-gray-500 mt-1">
                            Bienvenido al panel de operador
                        </span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                    {navigationItems.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => navigate(`/${name.toLowerCase()}`)}
                            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <Icon className="w-6 h-6 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">{name}</span>
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Órdenes Recientes</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.OrdenID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            #{order.OrdenID}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.nombre_completo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Q.{order.total_orden}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.Estado_De_La_Orden)}`}>
                                                {order.Estado_De_La_Orden}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewOrder(order.OrdenID)}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperatorDashboard