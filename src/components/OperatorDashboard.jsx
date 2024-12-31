import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const OperatorDashboard = () => {
    const [orders, setOrders] = useState([])
    const navigate = useNavigate()

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
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Es un gusto tenerte de nuevo, estas logueado como OPERADOR</h1>
            <div className='mb-6 flex flex-wrap gap-4'>
                {['Productos', 'Categorias', 'Marcas', 'Unidades de Medida', 'Presentaciones', 'Clientes', 'Usuarios'].map((section) => (
                    <button key={section}
                        onClick={() => navigate(`/${section.toLocaleLowerCase()}`)}
                        className='bg-blue-500 text-white px-4 py-2 rounded'
                    >
                        {section}
                    </button>
                ))}
                <button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded'>
                    Cerrar Sesion
                </button>
            </div>
            <table className='min-w-full bg-white border border-gray-300'>
                <thead>
                    <tr>
                        <th className='border px-4 py-2'>ID</th>
                        <th className='border px-4 py-2'>Cliente</th>
                        <th className='border px-4 py-2'>Total</th>
                        <th className='border px-4 py-2'>Estado</th>
                        <th className='border px-4 py-2'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.OrdenID}>
                            <td className='border px-4 py-2'>{order.OrdenID}</td>
                            <td className='border px-4 py-2'>{order.nombre_completo}</td>
                            <td className='border px-4 py-2'>{order.total_orden}</td>
                            <td className='border px-4 py-2'>{order.Estado_De_La_Orden}</td>
                            <td className='border px-4 py-2'>
                                <button
                                    onClick={() => handleViewOrder(order.OrdenID)}
                                    className='bg-green-500 text-white px-4 py-2 rounded'
                                >
                                    Ver Detalles
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OperatorDashboard