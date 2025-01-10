import React from "react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import TextInput from "../components/TextInput"
import { X } from "lucide-react"

const ConfirmarCarrito = () => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart')
        return savedCart ? JSON.parse(savedCart) : []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const [errors, setErrors] = useState({
        nombreCompleto: '',
        direccionOrden: '',
        telefonoOrden: '',
        correoElectronicoOrden: ''
    })

    const token = localStorage.getItem('token')
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.id
    const userName = decodedToken.nombreCompleto
    const userAddress = 'Direccion del cliente'
    const userPhone = decodedToken.telefono
    const userMail = decodedToken.correoElectronico

    const [userDetails, setUserDetails] = useState({
        usuarios_idUsuarios: '',
        nombreCompleto: '',
        direccionOrden: '',
        telefonoOrden: '',
        correoElectronicoOrden: ''
    })

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }

        setUserDetails((prev) => ({
            ...prev,
            nombreCompleto: userName,
            telefonoOrden: userPhone,
            correoElectronicoOrden: userMail
        }))
    }, [navigate])

    const handleQuantityChange = (productId, newQuantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.idProductos === productId ? { ...item, cantidad: newQuantity } : item
            )
        )
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

    const handleConfirmOrder = async () => {
        if (!validateForm()) {
            toast.error('Por favor complete los campos requeridos correctamente...')
            return
        }
        const token = localStorage.getItem('token')
        const totalOrden = cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
        const orderDetails = cart.map((product) => ({
            idProducto: product.idProductos,
            cantidad: product.cantidad,
            precio: product.precio
        }))


        try {
            await axios.post(
                'http://localhost:1234/api/orders',
                {
                    usuarios_idUsuarios: userId,
                    nombreCompleto: userDetails.nombreCompleto,
                    direccionOrden: userDetails.direccionOrden,
                    telefonoOrden: userDetails.telefonoOrden,
                    correoElectronicoOrden: userDetails.correoElectronicoOrden,
                    fechaEntregaOrden: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    totalOrden,
                    DetallesJSON: orderDetails
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('¡Orden confirmada exitosamente!')
            alert('¡Orden confirmada exitosamente!')
            localStorage.removeItem('cart')
            setCart([]);
            navigate('/cliente')
        } catch (error) {
            console.error('Error al confirmar la orden:', error)
            toast.error('Hubo un error al confirmar la orden.')
        }
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
    }

    const handleReturnToPurchase = () => {
        navigate('/cliente')
    }

    const handleRemoveItem = (itemToRemove) => {
        setCart(prevCart => prevCart.filter(item => item.idProductos !== itemToRemove.idProductos))
    }

    const totalAmount = cart.reduce((total, item) => total + item.precio * item.cantidad, 0)

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Confirmar Pedido</h1>

            {cart.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
                    <button
                        onClick={() => navigate('/cliente')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Volver a la tienda
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-md mb-6">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Productos en el carrito</h2>
                            <ul className="divide-y divide-gray-200">
                                {cart.map((item) => (
                                    <li key={item.idProductos} className="py-4 flex items-center gap-4">
                                        <img
                                            src={item.imagen_producto ? `data:image/jpeg;base64,${item.imagen_producto}` : '/defaultProduct.jpg'}
                                            alt={item.nombre}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium">{item.nombre}</h3>
                                            <p className="text-gray-600">Q.{item.precio}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.stock}
                                                value={item.cantidad}
                                                onChange={(e) => handleQuantityChange(item.idProductos, parseInt(e.target.value))}
                                                className="w-20 border rounded-lg p-2 text-center"
                                            />
                                            <span className="text-gray-500">/{item.stock}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">Q.{(item.precio * item.cantidad).toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={20} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="text-right">
                                    <p className="text-lg font-semibold">Total: Q.{totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md mb-6">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Datos de entrega</h2>
                            <div className="space-y-4">
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
                                <p className="text-sm text-gray-600">
                                    <strong>Fecha de entrega estimada:</strong>{' '}
                                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleConfirmOrder}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                        >
                            Confirmar Orden
                        </button>
                        <button
                            onClick={() => navigate('/cliente')}
                            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                        >
                            Seguir Comprando
                        </button>
                    </div>
                </>
            )}
        </div>
    )

}

export default ConfirmarCarrito