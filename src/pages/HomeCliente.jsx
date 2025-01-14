import React, { useEffect, useState, useCallback } from "react"
import ProductCard from "../components/ProductCard"
import Cart from "../components/Cart"
import OrderHistory from "../components/OrderHistory"
import SearchBox from "../components/SearchBox"
import CategoryFilter from "../components/CategoryFilter"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { LogOut, ShoppingCart, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
//import { toast, ToastContainer } from 'react-toastify'
//import 'react-toastify/dist/ReactToastify.css'
import { Toaster, toast } from "sonner"

const HomeCliente = () => {
    const apiURL = import.meta.env.VITE_API_URL
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart')
        return savedCart ? JSON.parse(savedCart) : []
    })
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)

    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.id
    const userName = decodedToken.nombreCompleto
    const userAddress = 'Direccion del cliente'
    const userPhone = decodedToken.telefono
    const userMail = decodedToken.correoElectronico

    const fetchProducts = useCallback(async (page = 1, category = null, search = '') => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}/api/products`, {
                params: {
                    page,
                    limit: 12,
                    category: category || undefined,
                    search: search || undefined
                },
                headers: { Authorization: `Bearer ${token}` }
            })

            const activeProducts = response.data.products.filter(p => p.estados_idEstados === 2)
            setProducts(activeProducts)
            setTotalPages(response.data.totalPages)
        } catch (error) {
            toast.error('Error al cargar productos')
            console.error('Error al obtener productos: ', error)
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        fetchProducts(currentPage, selectedCategory, searchTerm)
    }, [currentPage, selectedCategory, searchTerm, fetchProducts])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product, quantity = 1) => {
        if (product.stock < quantity) {
            toast.warning(`Solo hay ${product.stock} unidades disponibles`)
            return
        }
        const existingProductIndex = cart.findIndex(
            item => item.idProductos === product.idProductos
        )

        if (existingProductIndex > -1) {
            const updatedCart = [...cart]
            const totalQuantity = updatedCart[existingProductIndex].cantidad + quantity

            if (totalQuantity > product.stock) {
                toast.warning(`No puede agregar más de ${product.stock} unidades`)
                return
            }
            updatedCart[existingProductIndex] = {
                ...updatedCart[existingProductIndex],
                cantidad: totalQuantity
            }

            setCart(updatedCart)
        } else {
            setCart((prevCart) => [...prevCart, product])
        }
        toast.success(`${quantity} ${product.nombre} agregado(s) al carrito`)
    }
    const handleClearCart = () => {
        setCart([])
    }


    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category)
        setCurrentPage(1)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('cart')
        navigate('/login')
    }

    const handleRemoveItem = (itemToRemove) => {
        setCart(prevCart => prevCart.filter(item => item.idProductos !== itemToRemove.idProductos))
    }

    const handleUpdateQuantity = (productId, newQuantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.idProductos === productId
                    ? { ...item, cantidad: Math.max(1, Math.min(newQuantity, item.stock)) }
                    : item
            )
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" autoClose={3000} richColors closeButton />
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-800">Mi Tiendita Online</h1>
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">{userName}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
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
                </div>
            </header>

            <div className="container mx-auto p-4">
                <div className="mb-6 flex justify-between items-center">
                    <SearchBox onSearch={handleSearch} />
                    <CategoryFilter onFilter={handleCategoryFilter} />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.idProductos}
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                No se encontraron productos
                            </div>
                        )}
                    </>
                )}

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
            </div>

            {/* Modales para Carrito e Historial */}
            <Cart
                cart={cart}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={() => handleClearCart([])}
            />
            <OrderHistory />
        </div>
    )
}

export default HomeCliente