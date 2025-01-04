import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { ChevronLeft, Plus, Minus, Trash2 } from "lucide-react"

const OrderDetails = () => {
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [estado, setEstado] = useState()
    const [loading, setLoading] = useState(false)
    const { orderId } = useParams()

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
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`http://localhost:1234/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setOrder(response.data.data[0])
            } catch (error) {
                console.error('Error al obtener los detalles de la orden... ', error)
            }
        }
        fetchOrderDetails()
    }, [orderId])

    if (!order) {
        return <div>Cargando....</div>
    }

    const handleEstadoChange = async () => {
        const token = localStorage.getItem('token')
        try {

            setLoading(true)
            await axios.patch(`http://localhost:1234/api/orders/${orderId}`,
                {

                    estados_idEstados: estado
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Estado de la orden actualizado con exito!!!')
            location.reload()
        } catch (error) {
            console.error('Error al actualizar el estado de la orden...', error)
            alert('Hubo un problema al actualizar el estado...')
        } finally {
            setLoading(false)
        }
    }

    const handleItemQuantityChange = async (itemId, quantity) => {
        const token = localStorage.getItem('token')
        try {
            setLoading(true)
            const updatedDetalles = order.DetallesOrden.map((item) =>
                item.DetalleID === itemId ? { ...item, cantidad: quantity } : item
            )

            await axios.put(`http://localhost:1234/api/orders/${orderId}`, {
                DetallesJSON: updatedDetalles,
                total_orden: updatedDetalles.reduce((sum, item) => sum + item.cantidad * item.ProductoPrecio, 0)
            },

                { headers: { Authorization: `Bearer ${token}` } }
            )
            setOrder({ ...order, DetallesOrden: updatedDetalles })
        } catch (error) {
            console.error('Error al actualizar la cantidad del item', error)
            alert('Hubo un problema al actualizar la cantidad')
        } finally {
            setLoading(false)
        }
    }

    const handleAddItem = async (newItem) => {
        const token = localStorage.getItem('token')
        try {
            setLoading(true);
            const updatedDetalles = [...order.DetallesOrden, newItem]
            await axios.put(`http://localhost:1234/api/orders/${orderId}`, {
                DetallesJSON: updatedDetalles,
                total_orden: updatedDetalles.reduce((sum, item) => sum + item.cantidad * item.ProductoPrecio, 0)
            },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setOrder({ ...order, DetallesOrden: updatedDetalles })
        } catch (error) {
            console.error('Error al agregar un nuevo ítem:', error);
            alert('Hubo un problema al agregar el ítem.');
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveItem = async (itemId) => {
        const token = localStorage.getItem('token')
        try {
            setLoading(true)
            const updatedDetalles = order.DetallesOrden.filter((item) => item.DetalleID !== itemId)
            await axios.patch(`http://localhost:1234/api/orders/${orderId}`, {
                DetallesJSON: updatedDetalles,
                totalOrden: updatedDetalles.reduce((sum, item) => sum + item.cantidad * item.ProductoPrecio, 0),
            },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setOrder({ ...order, DetallesOrden: updatedDetalles })
        } catch (error) {
            console.error('Error al eliminar el ítem:', error)
            alert('Hubo un problema al eliminar el ítem.')
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <button
                onClick={() => navigate('/operador')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Regresar
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Orden #{order.OrdenID}</h1>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                        <p className="flex items-center">
                            <span className="font-semibold w-24 text-gray-600">Cliente:</span>
                            <span>{order.nombre_completo}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="font-semibold w-24 text-gray-600">Dirección:</span>
                            <span>{order.direccion}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="font-semibold w-24 text-gray-600">Teléfono:</span>
                            <span>{order.telefono}</span>
                        </p>
                    </div>
                    <div className="space-y-3">
                        <p className="flex items-center">
                            <span className="font-semibold w-32 text-gray-600">Correo:</span>
                            <span>{order.correo_electronico}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="font-semibold w-32 text-gray-600">Fecha entrega:</span>
                            <span>{order.fecha_entrega}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="font-semibold w-32 text-gray-600">Estado:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.Estado_De_La_Orden)}`}>
                                {order.Estado_De_La_Orden}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Cambiar estado</h3>
                    <div className="flex gap-4">
                        <select
                            value={estado}
                            onChange={(e) => setEstado(Number(e.target.value))}
                            className="border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled selected>Seleccione una opcion</option>
                            <option value={3}>Pendiente</option>
                            <option value={4}>Aprobado</option>
                            <option value={5}>Rechazado</option>
                            <option value={6}>En proceso</option>
                            <option value={7}>Enviado</option>
                            <option value={8}>Entregado</option>
                            <option value={9}>Cancelado</option>
                        </select>
                        <button
                            onClick={handleEstadoChange}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            Actualizar estado
                        </button>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Detalles de productos</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-600">Producto</th>
                                <th className="text-left px-6 py-3 text-gray-600">Descripción</th>
                                <th className="text-center px-6 py-3 text-gray-600">Cantidad</th>
                                <th className="text-right px-6 py-3 text-gray-600">Precio Unitario</th>
                                <th className="text-right px-6 py-3 text-gray-600">Subtotal</th>
                                <th className="text-center px-6 py-3 text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {order.DetallesOrden.map((detail) => (
                                <tr key={detail.DetalleID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{detail.ProductoNombre}</td>
                                    <td className="px-6 py-4">{detail.ProductoDescripcion}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleItemQuantityChange(detail.DetalleID, Math.max(1, detail.cantidad - 1))}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center">{detail.cantidad}</span>
                                            <button
                                                onClick={() => handleItemQuantityChange(detail.DetalleID, detail.cantidad + 1)}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">Q.{detail.ProductoPrecio}</td>
                                    <td className="px-6 py-4 text-right">Q.{detail.subtotal}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleRemoveItem(detail.DetalleID)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-semibold">
                                <td colSpan="4" className="px-6 py-4 text-right">Total</td>
                                <td className="px-6 py-4 text-right">Q.{order.total_orden}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

export default OrderDetails