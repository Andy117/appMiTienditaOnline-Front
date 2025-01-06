import React, { useEffect, useState } from 'react'

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No se encontró el token de autenticación');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:1234/api/orders/client', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setOrders(data.data);
            } catch (error) {
                setError('Error al cargar el historial de órdenes: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'PPP', { locale: es });
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'Aprobado': 'bg-green-100 text-green-800',
            'Cancelado': 'bg-red-100 text-red-800',
            'Rechazado': 'bg-orange-200 text-orange-900',
            'Enviado': 'bg-blue-200 text-blue-900',
            'En Proceso': 'bg-blue-100 text-blue-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800'
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Historial de Compras</h2>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-6 space-y-3 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-20 bg-gray-200 rounded w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-red-800">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                    <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h2 className="text-2xl font-bold">Historial de Compras</h2>
                </div>

                <div className="overflow-y-auto max-h-[600px] pr-2">
                    {orders.length === 0 ? (
                        <div className="bg-blue-50 text-blue-800 rounded-lg p-4 flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            No tienes compras confirmadas.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.OrdenID} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Orden #{order.OrdenID}
                                            </h3>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(order.fecha_entrega)}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {formatCurrency(order.total_orden)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.Estado_De_La_Orden)}`}>
                                            {order.Estado_De_La_Orden}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {order.DetallesOrden.map((detalle) => (
                                            <div
                                                key={detalle.DetalleID}
                                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{detalle.ProductoNombre}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {detalle.ProductoDescripcion}
                                                        </p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="text-sm text-gray-600">
                                                            {detalle.cantidad} x {formatCurrency(detalle.ProductoPrecio)}
                                                        </p>
                                                        <p className="font-medium mt-1">
                                                            {formatCurrency(detalle.subtotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;