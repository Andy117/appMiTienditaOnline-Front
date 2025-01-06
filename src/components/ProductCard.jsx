import React, { useState } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (product.stock >= quantity) {
            onAddToCart({ ...product, cantidad: quantity })
            setQuantity(1)
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md border p-4 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative">
                <img
                    src={product.imagen_producto ? `data:image/jpeg;base64,${product.imagen_producto}` : '/defaultProduct.jpg'}
                    alt={product.nombre}
                    className={`w-full h-48 object-cover rounded-t ${loading ? 'blur-sm' : ''}`}
                    onLoad={() => setLoading(false)}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/defaultProduct.jpg';
                    }}
                />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                        ¡Últimas unidades!
                    </span>
                )}
            </div>
            <div className="mt-4 space-y-3">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{product.nombre}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.descripcion}</p>
                <p className="text-xl font-semibold text-green-600">Q.{product.precio.toFixed(2)}</p>
                <div className="flex items-center justify-between">
                    <p className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                        {product.stock > 0 ? (
                            <>Stock: {product.stock}</>
                        ) : (
                            <><AlertCircle size={16} /> Sin stock</>
                        )}
                    </p>
                    {product.stock > 0 && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Cantidad:</label>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`mt-3 w-full px-4 py-2 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2
                        ${product.stock > 0
                            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    <ShoppingCart size={18} />
                    {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;