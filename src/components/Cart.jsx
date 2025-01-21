import React from 'react';
import { Trash2, ShoppingBag, X, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, onClearCart, onUpdateQuantity, onRemoveItem, isOpen, onClose }) => {
    const navigate = useNavigate()

    const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

    const handleContinueToOrder = () => {
        navigate('/confirmarCarrito')
        onClose()
    }



    return (
        <div
            className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out 
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="h-full flex flex-col">
                {/* Encabezado del carrito */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag className="text-blue-600" />
                        Carrito de Compra
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Contenido del carrito */}
                <div className="flex-grow overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">El carrito está vacío.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {cart.map((item, index) => (
                                <div key={index} className="py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.imagen_producto ? `data:image/jpeg;base64,${item.imagen_producto}` : '/defaultProduct.jpg'}
                                            alt={item.nombre}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{item.nombre}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.idProductos, item.cantidad - 1)}
                                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-l"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-3 text-sm">{item.cantidad}</span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.idProductos, item.cantidad + 1)}
                                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-r"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-green-600">
                                            Q.{(item.precio * item.cantidad).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => onRemoveItem(item)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pie del carrito */}
                {cart.length > 0 && (
                    <div className="p-6 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-green-600">
                                Q.{total.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <button
                                onClick={onClearCart}
                                className="w-1/2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} />
                                Vaciar Carrito
                            </button>
                            <button
                                onClick={handleContinueToOrder}
                                className="w-1/2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={18} />
                                Continuar con la Orden
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;