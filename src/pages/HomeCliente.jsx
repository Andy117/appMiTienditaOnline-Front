import React from "react"
import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"
import Cart from "../components/Cart"
import OrderHistory from "../components/OrderHistory"
import SearchBox from "../components/SearchBox"
import CategoryFilter from "../components/CategoryFilter"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

const HomeCliente = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.id
    const userName = decodedToken.nombreCompleto
    const userAddress = 'Direccion del cliente'
    const userPhone = decodedToken.telefono
    const userMail = decodedToken.correoElectronico

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true)
            const response = await axios.get(`http://localhost:1234/api/products?page=${page}&limit=15`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(response.data.products.filter(p => p.estados_idEstados === 2))
            setTotalPages(response.data.totalPages)
        } catch (error) {
            console.error('Error al obtener productos: ', error)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts(currentPage)
    }, [currentPage])

    const addToCart = (product) => {
        if (product.stock > 0) {
            setCart((prevCart) => [...prevCart, product])
        } else {
            alert('Este producto no tiene stock disponible...')
        }
    }

    const clearCart = () => {
        setCart([])
    }

    const confirmOrder = async () => {
        if (cart.length === 0) {
            alert('El carrito esta vacio...')
            return
        }

        const orderDetails = cart.map((product) => ({
            idProducto: product.idProductos,
            cantidad: product.cantidad,
            precio: product.precio,
        }));

        try {
            const response = await axios.post('http://localhost:1234/api/orders', {
                usuarios_idUsuarios: userId,
                nombreCompleto: userName,
                direccionOrden: userAddress,
                telefonoOrden: userPhone,
                correoElectronicoOrden: userMail,
                fechaEntregaOrden: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // +5 días
                totalOrden: cart.reduce((total, item) => total + item.precio * item.cantidad, 0), // Total basado en cantidades
                DetallesJSON: orderDetails,
            }, { headers: { Authorization: `Bearer ${token}` } })
            console.log(response)
            alert(response.data.message)
            clearCart()
        } catch (error) {
            console.error("Error al confirmar la orden:", error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>
                    <button
                        onClick={() => setCart([])}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Carrito ({cart.length})
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <div className="container mx-auto p-4">
                {/* Filtros y búsqueda */}
                <div className="flex justify-between items-center mb-4">
                    <SearchBox />
                    <CategoryFilter onFilter={(category) => fetchProducts(1, category)} />
                </div>

                {/* Catálogo de productos */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : (
                        products.map((product) => (
                            <ProductCard
                                key={product.idProductos}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))
                    )}
                </div>

                {/* Paginación */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-l bg-gray-200 hover:bg-gray-300"
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 border-t border-b">{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-r bg-gray-200 hover:bg-gray-300"
                    >
                        Siguiente
                    </button>
                </div>

                {/* Carrito */}
                <Cart
                    cart={cart}
                    onClearCart={clearCart}
                    onConfirmOrder={confirmOrder}
                />

                {/* Historial */}
                <OrderHistory />
            </div>
        </div>
    );
}

export default HomeCliente