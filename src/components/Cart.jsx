import React from 'react';
import { Trash2, ShoppingBag, X } from 'lucide-react';

const Cart = ({ cart, onClearCart, onConfirmOrder, onUpdateQuantity, onRemoveItem }) => {
    const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingBag className="text-blue-600" />
                    Carrito de Compra
                </h2>
                {cart.length > 0 && (
                    <button
                        onClick={onClearCart}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <Trash2 size={18} />
                        Vaciar carrito
                    </button>
                )}
            </div>

            {cart.length === 0 ? (
                <div className="text-center py-8">
                    <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">El carrito está vacío.</p>
                </div>
            ) : (
                <>
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
                                        <div className="flex items-center gap-4 mt-2">
                                            <select
                                                value={item.cantidad}
                                                onChange={(e) => onUpdateQuantity(item, parseInt(e.target.value))}
                                                className="border rounded px-2 py-1"
                                            >
                                                {[...Array(item.stock)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-sm text-gray-500">
                                                Q.{item.precio.toFixed(2)} c/u
                                            </p>
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

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-green-600">
                                Q.{total.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onClearCart}
                                className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                            >
                                <X size={18} />
                                Cancelar
                            </button>
                            <button
                                onClick={onConfirmOrder}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                            >
                                <ShoppingBag size={18} />
                                Confirmar Compra
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;