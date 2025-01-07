import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { ChevronLeft, Plus, Minus, Trash2, Save, X } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TextInput from "./TextInput"

const OrderDetails = () => {
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [editedOrder, setEditedOrder] = useState(null)
    const [estado, setEstado] = useState('')
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { orderId } = useParams()

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
                const response = await axios.get(`http://localhost:1234/api/orders/${orderId}`, {
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

            // Crear el array de detalles actualizados
            const updatedOrderDetails = editedOrder?.DetallesOrden?.map(detail => ({
                DetalleID: detail.DetalleID,
                idProducto: detail.ProductoID,
                precio: detail.ProductoPrecio,
                cantidad: detail.cantidad,
                subtotal: detail.subtotal
            })) || []

            // Calcular el total usando directamente el array de detalles
            const total = updatedOrderDetails.reduce((sum, detail) => sum + detail.subtotal, 0)

            // Hacer la petición al servidor
            await axios.put(`http://localhost:1234/api/orders/${orderId}`,
                {
                    nombreCompleto: userDetails.nombreCompleto,
                    direccionOrden: userDetails.direccionOrden,
                    telefonoOrden: userDetails.telefonoOrden,
                    correoElectronicoOrden: userDetails.correoElectronicoOrden,
                    fechaEntregaOrden: userDetails.fechaEntregaOrden,
                    totalOrden: total,
                    DetallesJSON: updatedOrderDetails  // Este array será convertido a JSON en el backend
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


    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <ToastContainer position="top-right" autoClose={3000} />
            <button
                onClick={() => navigate('/inicio')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Regresar
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Orden #{order.OrdenID}</h1>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                        <TextInput
                            label="Nombre Completo"
                            id="nombreCompleto"
                            name="nombreCompleto"
                            type="text"
                            placeholder="Ingresa el nombre de quien recibe la orden"
                            value={userDetails.nombreCompleto}
                            onChange={handleInputChange}
                            error={errors.nombreCompleto}
                        />
                        <TextInput
                            label="Dirección de entrega"
                            id="direccionOrden"
                            name="direccionOrden"
                            type="text"
                            placeholder="Ingresa la dirección donde desees recibir tus productos"
                            value={userDetails.direccionOrden}
                            onChange={handleInputChange}
                            error={errors.direccionOrden}
                        />
                        <TextInput
                            label="Teléfono"
                            id="telefonoOrden"
                            name="telefonoOrden"
                            type="tel"
                            placeholder="Ingresa un número de teléfono de 8 dígitos"
                            value={userDetails.telefonoOrden}
                            onChange={handleInputChange}
                            error={errors.telefonoOrden}
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
                        />
                    </div>
                    <div className="space-y-3">
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
                            <option value="" disabled>Seleccione una opción</option>
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
                            {editedOrder.DetallesOrden.map((detail) => (
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
                                <td className="px-6 py-4 text-right">Q.{calculateTotal()}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {isEditing && (
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={handleSaveChanges}
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}

export default OrderDetails