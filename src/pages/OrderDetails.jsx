import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { ChevronLeft, Plus, Minus, Trash2, Save, X } from "lucide-react"
//import { toast, ToastContainer } from 'react-toastify'
//import 'react-toastify/dist/ReactToastify.css'
import { toast, Toaster } from "sonner"
import TextInput from "../components/TextInput"

const OrderDetails = () => {
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [editedOrder, setEditedOrder] = useState(null)
    const [estado, setEstado] = useState('')
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { orderId } = useParams()
    const apiURL = import.meta.env.VITE_API_URL

    const [userDetails, setUserDetails] = useState({
        nombreCompleto: '',
        direccionOrden: '',
        telefonoOrden: '',
        correoElectronicoOrden: '',
        fechaEntregaOrden: '',
        totalOrden: ''
    })

    const [errors, setErrors] = useState({
        nombreCompleto: '',
        direccionOrden: '',
        telefonoOrden: '',
        correoElectronicoOrden: ''
    })

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

    const validateForm = () => {
        const newErrors = {}

        if (!userDetails.nombreCompleto.trim()) {
            newErrors.nombreCompleto = 'El nombre completo es requerido'
        }

        if (!userDetails.direccionOrden.trim()) {
            newErrors.direccionOrden = 'La dirección es requerida'
        }

        if (!userDetails.telefonoOrden.trim()) {
            newErrors.telefonoOrden = 'El teléfono es requerido';
        } else if (!/^\d{8}$/.test(userDetails.telefonoOrden.trim())) {
            newErrors.telefonoOrden = 'El teléfono debe tener 8 dígitos'
        }

        if (!userDetails.correoElectronicoOrden.trim()) {
            newErrors.correoElectronicoOrden = 'El correo electrónico es requerido'
        } else if (!/\S+@\S+\.\S+/.test(userDetails.correoElectronicoOrden)) {
            newErrors.correoElectronicoOrden = 'Ingrese un correo electrónico válido'
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0
    }

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${apiURL}/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const orderData = response.data.data[0]
                setOrder(orderData)
                setEditedOrder({
                    ...orderData,
                    DetallesOrden: orderData.DetallesOrden.map(detail => ({
                        ...detail,
                        idProducto: detail.ProductoID,
                        precio: detail.ProductoPrecio
                    }))
                })
                setUserDetails((prev) => ({
                    ...prev,
                    nombreCompleto: orderData.nombre_completo,
                    direccionOrden: orderData.direccion,
                    telefonoOrden: orderData.telefono,
                    correoElectronicoOrden: orderData.correo_electronico,
                    fechaEntregaOrden: orderData.fecha_entrega
                }))
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
            await axios.patch(`${apiURL}/api/orders/${orderId}`,
                {

                    estados_idEstados: estado
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Estado de la orden actualizado con exito!!!')
            location.reload()
        } catch (error) {
            console.error('Error al actualizar el estado de la orden...', error)
            if (error.response) {
                alert(`Hubo un problema al actualizar el estado: ${error.response.data.message}` || error.response.statusText)
            } else {
                alert('Hubo un problema al actualizar el estado...')
            }
            alert('Hubo un problema al actualizar el estado...')
        } finally {
            setLoading(false)
        }
    }

    const handleItemQuantityChange = (detalleId, newQuantity) => {
        if (!isEditing) setIsEditing(true)
        setEditedOrder(prev => ({
            ...prev,
            DetallesOrden: prev.DetallesOrden.map(detail =>
                detail.DetalleID === detalleId
                    ? {
                        ...detail,
                        cantidad: newQuantity,
                        subtotal: detail.ProductoPrecio * newQuantity
                    }
                    : detail
            )
        }))
    }

    const handleRemoveItem = (detalleId) => {
        if (!isEditing) setIsEditing(true)

        setEditedOrder(prev => ({
            ...prev,
            DetallesOrden: prev.DetallesOrden.filter(detail => detail.DetalleID !== detalleId)
        }))
    }

    const handleSaveChanges = async () => {
        if (!validateForm()) {
            toast.error('Por favor complete los campos requeridos correctamente...')
            return
        }
        const token = localStorage.getItem('token')
        try {
            setLoading(true)

            const updatedOrderDetails = editedOrder?.DetallesOrden?.map(detail => ({
                DetalleID: detail.DetalleID,
                idProducto: detail.ProductoID,
                precio: detail.ProductoPrecio,
                cantidad: detail.cantidad,
                subtotal: detail.subtotal
            })) || []

            const total = updatedOrderDetails.reduce((sum, detail) => sum + detail.subtotal, 0)

            await axios.put(`${apiURL}/api/orders/${orderId}`,
                {
                    nombreCompleto: userDetails.nombreCompleto,
                    direccionOrden: userDetails.direccionOrden,
                    telefonoOrden: userDetails.telefonoOrden,
                    correoElectronicoOrden: userDetails.correoElectronicoOrden,
                    fechaEntregaOrden: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    totalOrden: total,
                    DetallesJSON: updatedOrderDetails
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            alert('Orden actualizada exitosamente')

            toast.success('Orden actualizada exitosamente')
            setIsEditing(false)
            location.reload()
        } catch (error) {
            alert('Hubo un problema al guardar los cambios')
            console.error('Error al guardar los cambios:', error)
            toast.error('Hubo un problema al guardar los cambios')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditedOrder(order)
        setIsEditing(false)
    }

    const calculateTotal = () => {
        return editedOrder.DetallesOrden.reduce((total, detail) => total + detail.subtotal, 0)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }))

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }))
        setIsEditing(true)
    }

    const handleCancelOrder = async () => {
        const token = localStorage.getItem('token')
        try {
            setLoading(true)
            await axios.put(`${apiURL}/api/orders/cancel/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('Orden cancelada exitosamente')
            alert('Orden Cancelada Exitosamente')
            navigate('/inicio')
        } catch (error) {
            console.error('Error al cancelar la orden:', error)
            toast.error('Error al cancelar la orden')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Toaster position="top-right" autoClose={3000} richColors closeButton />

            {/* Encabezado con botón de retorno */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/inicio')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Regresar</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Orden #{order.OrdenID}</h1>
            </div>

            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Sección de Información del Cliente */}
                <div className="grid md:grid-cols-2 gap-8 p-6 bg-gray-50 border-b">
                    <div className="space-y-6">
                        <TextInput
                            label="Nombre Completo"
                            id="nombreCompleto"
                            name="nombreCompleto"
                            type="text"
                            placeholder="Ingresa el nombre de quien recibe la orden"
                            value={userDetails.nombreCompleto}
                            onChange={handleInputChange}
                            error={errors.nombreCompleto}
                            className="shadow-sm"
                        />
                        <TextInput
                            label="Dirección de entrega"
                            id="direccionOrden"
                            name="direccionOrden"
                            type="text"
                            placeholder="Ingresa la dirección de entrega"
                            value={userDetails.direccionOrden}
                            onChange={handleInputChange}
                            error={errors.direccionOrden}
                            className="shadow-sm"
                        />
                    </div>
                    <div className="space-y-6">
                        <TextInput
                            label="Teléfono"
                            id="telefonoOrden"
                            name="telefonoOrden"
                            type="tel"
                            placeholder="Ingresa un número de teléfono"
                            value={userDetails.telefonoOrden}
                            onChange={handleInputChange}
                            error={errors.telefonoOrden}
                            className="shadow-sm"
                        />
                        <TextInput
                            label="Correo electrónico"
                            id="correoElectronicoOrden"
                            name="correoElectronicoOrden"
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={userDetails.correoElectronicoOrden}
                            onChange={handleInputChange}
                            error={errors.correoElectronicoOrden}
                            className="shadow-sm"
                        />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            <strong>Fecha de entrega:</strong>{' '}
                            {userDetails.fechaEntregaOrden}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            <strong>Fecha de entrega estimada (si actualiza la orden):</strong>{' '}
                            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Sección de Estado de la Orden */}
                <div className="p-6 bg-white border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Estado de la Orden</h3>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.Estado_De_La_Orden)}`}
                        >
                            {order.Estado_De_La_Orden}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={estado}
                            disabled={loading || order.Estado_De_La_Orden !== 'Pendiente'}
                            onChange={(e) => setEstado(Number(e.target.value))}
                            className="flex-grow border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="" disabled>Seleccione un nuevo estado</option>
                            <option value={3}>Pendiente</option>
                            <option value={4}>Aprobado</option>

                            <option value={6}>En proceso</option>
                            <option value={7}>Enviado</option>
                            <option value={8}>Entregado</option>

                        </select>
                        <button
                            onClick={handleEstadoChange}
                            disabled={loading || order.Estado_De_La_Orden !== 'Pendiente'}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
                        >
                            Actualizar
                        </button>

                        <button
                            onClick={handleCancelOrder}
                            disabled={loading || order.Estado_De_La_Orden !== 'Pendiente'}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar Orden
                        </button>
                    </div>
                </div>

                {/* Tabla de Productos */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Detalles de Productos</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Producto</th>
                                    <th className="py-3 px-6 text-left">Descripción</th>
                                    <th className="py-3 px-6 text-center">Cantidad</th>
                                    <th className="py-3 px-6 text-right">Precio</th>
                                    <th className="py-3 px-6 text-right">Subtotal</th>
                                    <th className="py-3 px-6 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {editedOrder.DetallesOrden.map((detail) => (
                                    <tr key={detail.DetalleID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{detail.ProductoNombre}</td>
                                        <td className="px-6 py-4">{detail.ProductoDescripcion}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleItemQuantityChange(detail.DetalleID, Math.max(1, detail.cantidad - 1))}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                    disabled={order.Estado_De_La_Orden !== 'Pendiente'}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center">{detail.cantidad}</span>
                                                <button
                                                    onClick={() => handleItemQuantityChange(detail.DetalleID, detail.cantidad + 1)}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                    disabled={order.Estado_De_La_Orden !== 'Pendiente'}
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
                                                    disabled={loading || order.Estado_De_La_Orden !== 'Pendiente'}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold">
                                    <td colSpan="4" className="text-right px-6 py-3">Total</td>
                                    <td className="text-right px-6 py-3 text-green-600">Q.{calculateTotal()}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Botones de Accción */}
                {isEditing && (
                    <div className="p-6 bg-gray-50 flex justify-end gap-4">
                        <button
                            onClick={handleCancelEdit}
                            className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Guardar Cambios
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderDetails