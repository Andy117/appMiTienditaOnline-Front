import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, ChevronLeftCircle, Edit, CheckCircle, Trash } from 'lucide-react'
import AdminHeader from '../components/AdminHeader';

const ProductTable = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const productsPerPage = 15
    const navigate = useNavigate()
    const [deactivatingItem, setDeactivatingItem] = useState(null)
    const [activatingItem, setActivatingItem] = useState(null)
    const { id } = useParams()

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:1234/api/products/operator?page=${page}&limit=${productsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleActivate = async (id) => {
        if (window.confirm('Estas seguro que deseas activar este producto?')) {
            try {
                const token = localStorage.getItem('token')
                await axios.patch(`http://localhost:1234/api/products/activate/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                alert('Producto activado exitosamente...')
                fetchProducts(currentPage)
            } catch (error) {
                console.error('Error al activar el producto...', error)
                alert('Hubo un error al activar el producto.')
            }
        }
    }
    const handleDeactivate = async (id) => {
        if (window.confirm('Estas seguro que deseas desactivar este producto?')) {
            try {
                const token = localStorage.getItem('token')
                await axios.patch(`http://localhost:1234/api/products/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                alert('Producto desactivado exitosamente...')
                fetchProducts(currentPage)
            } catch (error) {
                console.error('Error al desactivado el producto...', error)
                alert('Hubo un error al desactivado el producto.')
            }
        }
    }

    useEffect(() => {
        fetchProducts(currentPage)
    }, [currentPage])

    const totalPages = Math.ceil(totalProducts / productsPerPage)

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <AdminHeader
                    h1='Panel de Control - Operador'
                    span='Panel de: Productos'
                />
                {/* Header y Botones */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Gestión de Productos
                            <span className="block text-sm font-normal text-gray-500 mt-1">
                                Total de productos: {totalProducts}
                            </span>
                        </h1>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/inicio')}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeftCircle className="w-4 h-4" />
                                Regresar
                            </button>
                            <button
                                onClick={() => navigate('/AgregarProducto')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar Producto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-500">Cargando productos...</div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">

                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.idProductos} className="hover:bg-gray-50">

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.nombre}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                    {product.descripcion}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs ">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.estados_idEstados === 2
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {product.estados_idEstados === 2 ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 25
                                                        ? 'bg-green-100 text-green-800'
                                                        : product.stock > 5 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Q.{product.precio}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => navigate(`/EditarProducto/${product.idProductos}`)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Editar
                                                    </button>
                                                    {
                                                        product.estados_idEstados === 1 && (
                                                            <button
                                                                onClick={() => handleActivate(product.idProductos)}
                                                                className='px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors'
                                                            >
                                                                <CheckCircle className='w-4 h-4' />
                                                                Activar
                                                            </button>
                                                        )
                                                    }
                                                    {
                                                        product.estados_idEstados === 2 && (
                                                            <button
                                                                onClick={() => handleDeactivate(product.idProductos)}
                                                                className='px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors'
                                                            >
                                                                <Trash className='w-4 h-4' />
                                                                Desactivar
                                                            </button>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
                                <div className="text-sm text-gray-500">
                                    Mostrando {(currentPage - 1) * productsPerPage + 1} a {Math.min(currentPage * productsPerPage, totalProducts)} de {totalProducts} productos
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Anterior
                                    </button>
                                    <span className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg">
                                        {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        disabled={currentPage === totalPages}
                                    >
                                        Siguiente
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductTable;