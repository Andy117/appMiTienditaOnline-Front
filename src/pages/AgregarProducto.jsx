import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Upload } from "lucide-react"
import SelectInput from "../components/SelectInput"
import TextInput from "../components/TextInput"
import TextAreaInput from "../components/TextAreaInput"
import FileInput from "../components/FileInput"

const AgregarProducto = () => {
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [presentations, setPresentations] = useState([])
    const [measures, setMeasures] = useState([])
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const validationSchema = Yup.object({
        idCategoriaProductos: Yup.number().required('Selecciona una categoria'),
        idMarcaProductos: Yup.number().required('Selecciona una marca'),
        idPresentacionProductos: Yup.number().required('Selecciona una presentacion'),
        idUnidadMedida: Yup.number().required('Selecciona una unidad de medida'),
        nombreProducto: Yup.string().min(3, 'Minimo 3 caracteres').required('El nombre de producto es obligatorio'),
        descripcionProducto: Yup.string().min(10, 'Minimo 10 caracteres').max(300, 'maximo 300 caracteres').required('Este campo es obligatorio'),
        codigoProducto: Yup.string().required('El codigo de producto es obligatorio.'),
        stockProducto: Yup.number().positive('Debe ser mayor a 1').required('El stock es obligatorio'),
        precioProducto: Yup.number().positive('Debe ser mayor a 1').required('El precio del producto es obligatorio'),
        imagenProducto: Yup.mixed().nullable()
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, brandsRes, presentationsRes, measuresRes] = await Promise.all([
                    axios.get('http://localhost:1234/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:1234/api/brands', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:1234/api/presentations', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:1234/api/measures', { headers: { Authorization: `Bearer ${token}` } }),
                ])
                setCategories(categoriesRes.data)
                setBrands(brandsRes.data)
                setPresentations(presentationsRes.data)
                setMeasures(measuresRes.data)
            } catch (error) {
                console.error('Error al cargar datos...', error)
            }
        }
        fetchData()
    }, [])

    const formik = useFormik({
        initialValues: {
            idCategoriaProductos: '',
            idMarcaProductos: '',
            idPresentacionProductos: '',
            idUnidadMedida: '',
            nombreProducto: '',
            descripcionProducto: '',
            codigoProducto: '',
            stockProducto: '',
            precioProducto: '',
            imagenProducto: null
        },
        validationSchema,

        onSubmit: async (values) => {
            setLoading(true)
            try {
                const productData = {
                    idCategoriaProducto: Number(values.idCategoriaProductos),
                    idMarcaProducto: Number(values.idMarcaProductos),
                    idPresentacionProducto: Number(values.idPresentacionProductos),
                    idUnidadDeMedidaProducto: Number(values.idUnidadMedida),
                    nombreProducto: values.nombreProducto,
                    descripcionProducto: values.descripcionProducto,
                    codigoProducto: values.codigoProducto,
                    stockProducto: Number(values.stockProducto),
                    precioProducto: Number(values.precioProducto)
                }

                if (values.imagenProducto) {
                    const formData = new FormData()
                    Object.keys(productData).forEach(key => {
                        formData.append(key, productData[key])
                    })
                    formData.append('imagenProducto', values.imagenProducto)

                    await axios.post('http://localhost:1234/api/products', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": 'multipart/form-data'
                        }
                    })
                } else {
                    await axios.post('http://localhost:1234/api/products', productData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": 'application/json'
                        }
                    })
                }

                alert('Producto agregado exitosamente')
                location.reload()
            } catch (error) {
                console.error('Error al agregar producto', error)
                alert('Error al agregar producto')
            } finally {
                setLoading(false)
            }
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Agregar Nuevo Producto
                            <span className="block text-sm font-normal text-gray-500 mt-1">
                                Complete los datos del producto
                            </span>
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/productos')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Regresar
                    </button>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Sección de Clasificación */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b">
                                    Clasificación del Producto
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Categoría */}
                                    <SelectInput
                                        label='Categoria'
                                        id='idCategoriaProductos'
                                        name='idCategoriaProductos'
                                        value={formik.values.idCategoriaProductos}
                                        onChange={formik.handleChange}
                                        options={categories.map((cat) => ({ value: cat.idCategoriaProductos, label: cat.nombre_categoria }))}
                                        error={formik.errors.idCategoriaProductos && formik.touched.idCategoriaProductos && formik.errors.idCategoriaProductos}
                                    />
                                    {/* Marca */}
                                    <SelectInput
                                        label='Marca'
                                        id='idMarcaProductos'
                                        name='idMarcaProductos'
                                        value={formik.values.idMarcaProductos}
                                        onChange={formik.handleChange}
                                        options={brands.map((brand) => ({ value: brand.idMarcaProductos, label: brand.nombre_marca }))}
                                        error={formik.errors.idMarcaProductos && formik.touched.idMarcaProductos && formik.errors.idMarcaProductos}
                                    />
                                    {/* Presentación */}
                                    <SelectInput
                                        label='Presentacion'
                                        id='idPresentacionProductos'
                                        name='idPresentacionProductos'
                                        value={formik.values.idPresentacionProductos}
                                        onChange={formik.handleChange}
                                        options={presentations.map((pres) => ({ value: pres.idPresentacionProductos, label: pres.nombre_presentacion }))}
                                        error={formik.errors.idPresentacionProductos && formik.touched.idPresentacionProductos && formik.errors.idPresentacionProductos}
                                    />
                                    {/* Unidad de Medida */}
                                    <SelectInput
                                        label='Unidad de Medida'
                                        id='idUnidadMedida'
                                        name='idUnidadMedida'
                                        value={formik.values.idUnidadMedida}
                                        onChange={formik.handleChange}
                                        options={measures.map((measure) => ({ value: measure.idUnidadMedida, label: measure.nombre_unidad }))}
                                        error={formik.errors.idUnidadMedida && formik.touched.idUnidadMedida && formik.errors.idUnidadMedida}
                                    />
                                </div>
                            </div>

                            {/* Sección de Información Básica */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b">
                                    Información Básica
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre */}
                                    <TextInput
                                        label='Nombre del Producto'
                                        id='nombreProducto'
                                        name='nombreProducto'
                                        type="text"
                                        placeholder='Ingresa el nombre en este espacio'
                                        value={formik.values.nombreProducto}
                                        onChange={formik.handleChange}
                                        error={formik.errors.nombreProducto && formik.touched.nombreProducto && formik.errors.nombreProducto}
                                    />
                                    {/* Código */}
                                    <TextInput
                                        label='Código del Producto'
                                        id='codigoProducto'
                                        name='codigoProducto'
                                        type="text"
                                        placeholder='Ingresa el codigo ejemplo: JAB10GR'
                                        value={formik.values.codigoProducto}
                                        onChange={formik.handleChange}
                                        error={formik.errors.codigoProducto && formik.touched.codigoProducto && formik.errors.codigoProducto}
                                    />

                                    {/* Descripción - Ancho completo */}
                                    <div className="col-span-2">
                                        <TextAreaInput
                                            label='Descripción'
                                            id='descripcionProducto'
                                            name='descripcionProducto'
                                            value={formik.values.descripcionProducto}
                                            onChange={formik.handleChange}
                                            error={formik.errors.descripcionProducto && formik.touched.descripcionProducto && formik.errors.descripcionProducto}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sección de Inventario y Precios */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b">
                                    Inventario y Precios
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Stock */}
                                    <TextInput
                                        label='Stock Inicial'
                                        id='stockProducto'
                                        name='stockProducto'
                                        type="number"
                                        min='0'
                                        placeholder='Cantidad inicial de producto'
                                        value={formik.values.stockProducto}
                                        onChange={formik.handleChange}
                                        error={formik.errors.stockProducto && formik.touched.stockProducto && formik.errors.stockProducto}
                                    />
                                    {/* Precio */}
                                    <TextInput
                                        label='Precio (Q)'
                                        id='precioProducto'
                                        name='precioProducto'
                                        type="number"
                                        min='0'
                                        placeholder='Ingresa el precio'
                                        value={formik.values.precioProducto}
                                        onChange={formik.handleChange}
                                        error={formik.errors.precioProducto && formik.touched.precioProducto && formik.errors.precioProducto}
                                    />
                                </div>
                            </div>

                            {/* Sección de Imagen */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 pb-2 border-b">
                                    Imagen del Producto
                                </h3>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <FileInput

                                                id='imagenProducto'
                                                name='imagenProducto'
                                                accept='image/*'
                                                onChange={(event) => {
                                                    formik.setFieldValue('imagenProducto', event.currentTarget.files[0])
                                                }}
                                            />
                                            <p className="pl-1">o arrastra aquí</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG</p>
                                    </div>
                                </div>
                                {formik.errors.imagenProducto && formik.touched.imagenProducto && (
                                    <p className="mt-1 text-sm text-red-600">{formik.errors.imagenProducto}</p>
                                )}
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => navigate('/productos')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </span>
                                    ) : 'Guardar Producto'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}


export default AgregarProducto