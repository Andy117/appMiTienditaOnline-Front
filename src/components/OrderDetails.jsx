import React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const OrderDetails = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Detalles de la Orden # {order.OrdenID}</h1>
            <p><strong>Cliente:</strong> {order.nombre_completo}</p>
            <p><strong>Direccion:</strong> {order.direccion}</p>
            <p><strong>Telefono:</strong> {order.telefono}</p>
            <p><strong>Correo:</strong> {order.correo_electronico}</p>
            <p><strong>Total:</strong> {order.total_orden}</p>
            <p><strong>Estado:</strong> {order.Estado_De_La_Orden}</p>
            <h2 className="text-xl font-bold mt-6">Detalles:</h2>
            <table className="min-w-full bg-white border border-gray-300 mt-4">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Producto</th>
                        <th className="border px-4 py-2">Descripcion</th>
                        <th className="border px-4 py-2">Cantidad</th>
                        <th className="border px-4 py-2">Precio Unitario</th>
                        <th className="border px-4 py-2">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.DetallesOrden.map((detail) => (
                        <tr key={detail.DetalleID}>
                            <td className="border px-4 py-2">{detail.ProductoNombre}</td>
                            <td className="border px-4 py-2">{detail.ProductoDescripcion}</td>
                            <td className="border px-4 py-2">{detail.cantidad}</td>
                            <td className="border px-4 py-2">Q.{detail.ProductoPrecio}</td>
                            <td className="border px-4 py-2">Q.{detail.subtotal}</td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="font-bold border px-4 py-2">Total</td>
                        <td className="font-bold border px-4 py-2">Q.{order.total_orden}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OrderDetails