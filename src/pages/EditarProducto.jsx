import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminHeader from './../components/AdminHeader'
import { ChevronLeft, Save } from 'lucide-react'
import TextInput from '../components/TextInput'
import SelectInput from '../components/SelectInput'
import TextAreaInput from '../components/TextAreaInput'
import FileInput from '../components/FileInput'

const EditarProducto = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [presentations, setPresentations] = useState([])
    const [measures, setMeasures] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [categoriesRes, brandsRes, presentationsRes, measuresRes, productRes] = await Promise.all([
                    axios.get('http://localhost:1234/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:1234/api/brands', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:1234/api/presentations', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:1234/api/measures', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`http://localhost:1234/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setCategories(categoriesRes.data);
                setBrands(brandsRes.data);
                setPresentations(presentationsRes.data);
                setMeasures(measuresRes.data);

                const product = productRes.data;
                setCurrentImage(product.imagen_producto);

                formik.setValues({
                    idCategoriaProducto: product.CategoriaProductos_idCategoriaProductos,
                    idMarcaProducto: product.MarcaProductos_idMarcaProductos,
                    idPresentacionProducto: product.PresentacionProductos_idPresentacionProductos,
                    idUnidadDeMedidaProducto: product.UnidadDeMedidaProductos_idUnidadMedida,
                    nombreProducto: product.nombre,
                    descripcionProducto: product.descripcion,
                    codigoProducto: product.codigo,
                    stockProducto: product.stock,
                    precioProducto: product.precio
                });
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        fetchData();
    }, [id]);

    const formik = useFormik({
        initialValues: {
            idCategoriaProducto: '',
            idMarcaProducto: '',
            idPresentacionProducto: '',
            idUnidadDeMedidaProducto: '',
            nombreProducto: '',
            descripcionProducto: '',
            codigoProducto: '',
            stockProducto: '',
            precioProducto: '',
            imagenProducto: null,
        },
        validationSchema: Yup.object({
            idCategoriaProducto: Yup.number().required('Selecciona una categoría'),
            idMarcaProducto: Yup.number().required('Selecciona una marca'),
            idPresentacionProducto: Yup.number().required('Selecciona una presentación'),
            idUnidadDeMedidaProducto: Yup.number().required('Selecciona una unidad de medida'),
            nombreProducto: Yup.string().min(3, 'Mínimo 3 caracteres').required('Campo obligatorio'),
            descripcionProducto: Yup.string().min(10, 'Mínimo 10 caracteres').max(300, 'Máximo 300 caracteres').required('Campo obligatorio'),
            codigoProducto: Yup.string().required('Campo obligatorio'),
            stockProducto: Yup.number().positive('Debe ser mayor a 0').required('Campo obligatorio'),
            precioProducto: Yup.number().positive('Debe ser mayor a 0').required('Campo obligatorio'),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const formData = new FormData()

                if (values.imagenProducto) {
                    formData.append('imagenProducto', values.imagenProducto)
                }

                Object.keys(values).forEach((key) => {
                    if (key !== 'imagenProducto') {
                        formData.append(key, values[key])
                    }
                });

                console.log('Datos a enviar:', Object.fromEntries(formData.entries()));

                const token = localStorage.getItem('token')
                await axios.put(`http://localhost:1234/api/products/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                alert('Producto actualizado con éxito')
                location.reload()
            } catch (error) {
                console.error('Error al actualizar producto:', error)
                alert('Error al actualizar el producto')
            } finally {
                setLoading(false)
            }
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <AdminHeader h1="Editar Producto" span={`ID Producto: #${id}`} />
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Categorías y Marcas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Categoría */}
                                <SelectInput
                                    label='Categoria Actual'
                                    id="idCategoriaProducto"
                                    name="idCategoriaProducto"
                                    value={formik.values.idCategoriaProducto}
                                    onChange={formik.handleChange}
                                    options={categories.map((cat) => ({ value: cat.idCategoriaProductos, label: cat.nombre_categoria }))}
                                    error={formik.errors.idCategoriaProducto && formik.touched.idCategoriaProducto && formik.errors.idCategoriaProducto}

                                />
                                <SelectInput
                                    label='Marca Actual'
                                    id="idMarcaProducto"
                                    name="idMarcaProducto"
                                    value={formik.values.idMarcaProducto}
                                    onChange={formik.handleChange}
                                    options={brands.map((br) => ({ value: br.idMarcaProductos, label: br.nombre_marca }))}
                                    error={formik.errors.idMarcaProducto && formik.touched.idMarcaProducto && formik.errors.idMarcaProducto}

                                />
                                <SelectInput
                                    label='Unidad de Medida Actual'
                                    id="idUnidadDeMedidaProducto"
                                    name="idUnidadDeMedidaProducto"
                                    value={formik.values.idUnidadDeMedidaProducto}
                                    onChange={formik.handleChange}
                                    options={measures.map((mes) => ({ value: mes.idUnidadMedida, label: mes.nombre_unidad }))}
                                    error={formik.errors.idUnidadDeMedidaProducto && formik.touched.idUnidadDeMedidaProducto && formik.errors.idUnidadDeMedidaProducto}

                                />
                                <SelectInput
                                    label='Presentacion Actual'
                                    id="idPresentacionProducto"
                                    name="idPresentacionProducto"
                                    value={formik.values.idPresentacionProducto}
                                    onChange={formik.handleChange}
                                    options={presentations.map((pres) => ({ value: pres.idPresentacionProductos, label: pres.nombre_presentacion }))}
                                    error={formik.errors.idPresentacionProducto && formik.touched.idPresentacionProducto && formik.errors.idPresentacionProducto}

                                />
                                <TextInput
                                    label='Nombre del producto'
                                    id='nombreProducto'
                                    name='nombreProducto'
                                    type='text'
                                    placeholder='Ingrese nuevo nombre del producto'
                                    value={formik.values.nombreProducto}
                                    onChange={formik.handleChange}
                                    error={formik.errors.nombreProducto && formik.touched.nombreProducto && formik.errors.nombreProducto}
                                />
                                <TextInput
                                    label='Codigo Actual del Producto'
                                    id='codigoProducto'
                                    name='codigoProducto'
                                    value={formik.values.codigoProducto}
                                    placeholder='Ingrese nuevo codigo del producto, ejemplo: PROD123UN'
                                    onChange={formik.handleChange}
                                    error={formik.errors.codigoProducto && formik.touched.codigoProducto && formik.errors.codigoProducto}
                                />
                                <TextInput
                                    label='Stock disponible del Producto'
                                    id='stockProducto'
                                    name='stockProducto'
                                    value={formik.values.stockProducto}
                                    placeholder='Modifique el stock actual del producto'
                                    onChange={formik.handleChange}
                                    error={formik.errors.stockProducto && formik.touched.stockProducto && formik.errors.stockProducto}
                                />
                                <TextInput
                                    label='Precio actual del Producto (Q.)'
                                    id='precioProducto'
                                    name='precioProducto'
                                    value={formik.values.precioProducto}
                                    placeholder='Ingrese el nuevo precio del producto'
                                    onChange={formik.handleChange}
                                    error={formik.errors.precioProducto && formik.touched.precioProducto && formik.errors.precioProducto}
                                />
                                <TextAreaInput
                                    label='Descripcion Actual del Producto'
                                    id='descripcionProducto'
                                    name='descripcionProducto'
                                    value={formik.values.descripcionProducto}
                                    onChange={formik.handleChange}
                                    error={formik.errors.descripcionProducto && formik.touched.descripcionProducto && formik.errors.descripcionProducto}
                                />
                                {/* Otros combos y textboxes aquí */}
                            </div>
                            {/* Imagen actual */}
                            {currentImage ? (
                                <img
                                    src={`data:image/jpeg;base64,${currentImage}`}
                                    alt="Producto actual"
                                    className="max-w-xs rounded"
                                />
                            ) : (
                                <img
                                    src="/defaultProduct.jpg"
                                    alt="Imagen por defecto"
                                    className="max-w-xs rounded"
                                />
                            )}

                            {/* Cargar nueva imagen */}
                            <div>

                                <FileInput
                                    label='Actualizar Imagen (opcional)'
                                    id='imagenProducto'
                                    name='imagenProducto'
                                    accept='image/*'
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0]
                                        if (file) {
                                            formik.setFieldValue('imagenProducto', file)
                                        } else {
                                            formik.setFieldValue('imagenProducto', null)
                                        }
                                    }}
                                    error={formik.errors.imagenProducto && formik.touched.imagenProducto && formik.errors.imagenProducto}
                                />
                            </div>

                            {/* Botón de guardar */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button
                                    onClick={() => navigate('/productos')}
                                    type="button"
                                    className="flex items-center gap-2 ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    <ChevronLeft className='w-4 h-4' />
                                    Regresar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarProducto;
