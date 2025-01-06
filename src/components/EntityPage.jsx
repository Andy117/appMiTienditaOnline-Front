import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PaginatedTable from './PaginatedTable'
import FormModal from './FormModal'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Plus, ChevronLeftCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const EntityPage = ({ entityName, apiUrl, fields, keyID, type }) => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpen2, setIsModalOpen2] = useState(false)
    const [isModalOpenDeact, setIsModalOpenDeact] = useState(false)
    const [isModalOpenAct, setIsModalOpenAct] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [deactivatingItem, setDeactivatingItem] = useState(null)
    const [activatingItem, setActivatingItem] = useState(null)
    const [deletingItem, setDeletingItem] = useState(null)
    const token = localStorage.getItem('token');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/allPagination?page=${currentPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setData(res.data[type]);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error(`Error fetching ${entityName} data:`, error);
            }
        }
        fetchData()
    }, [currentPage])

    const formik = useFormik({
        initialValues: fields.reduce((acc, field) => {
            acc[field.name] = ''
            return acc
        }, {}),
        validationSchema: Yup.object(
            fields.reduce((acc, field) => {
                acc[field.name] = field.validation
                return acc
            }, {})
        ),
        onSubmit: async (values) => {
            try {
                if (editingItem) {
                    try {
                        await axios.put(`${apiUrl}/${editingItem[keyID]}`, values, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        alert(`${entityName} editada con exito!`)
                    } catch (error) {
                        console.error(`Error al editar la ${entityName}`, error)
                        alert(`Hubo un error, la ${entityName} ya existe...`)
                    }

                } else if (deactivatingItem) {
                    try {
                        await axios.patch(`${apiUrl}/${deactivatingItem[keyID]}`, values, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        alert(`${entityName} desactivado con exito!`)
                    } catch (error) {
                        console.error(`Error al desactivar la ${entityName}`, error)
                        alert(`Hubo un error, al intentar desactivar la ${entityName}...`)
                    }
                } else if (activatingItem) {
                    try {
                        await axios.patch(`${apiUrl}/activate/${activatingItem[keyID]}`, values, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        alert(`${entityName} Activada con exito!`)
                    } catch (error) {
                        console.error(`Error al Activar la ${entityName}`, error)
                        alert(`Hubo un error, al intentar activar la ${entityName}...`)
                    }
                }
                else {
                    try {
                        await axios.post(apiUrl, values, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        alert(`${entityName} agregada con exito!`)
                    } catch (error) {
                        console.error(`Error al agregar la ${entityName}`, error)
                        alert(`Hubo un error, la ${entityName} ya existe..`)
                    }
                }
                setIsModalOpen(false)
                setEditingItem(null)
                setCurrentPage(1)

            } catch (error) {
                console.error('Error al realizar la operacion solicitada...:', error);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Gestión de {entityName}
                            </h1>
                            <p className="block text-sm font-normal text-gray-500 mt-1">
                                Administra las {entityName.toLowerCase()}s del sistema
                            </p>
                        </div>
                        <div className='flex gap-3'>
                            <button
                                onClick={() => navigate('/inicio')}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeftCircle className="w-4 h-4" />
                                Regresar
                            </button>
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setIsModalOpen2(true);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="h-5 w-5 mr-1.5" />
                                Agregar {entityName}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <PaginatedTable
                        data={data}
                        columns={fields.map((field) => ({
                            header: field.label,
                            accessor: field.name
                        }))}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        keyID={keyID}
                        onEdit={(item) => {
                            setEditingItem(item);
                            formik.setValues(item);
                            setIsModalOpen(true);
                        }}
                        onDeactivate={(item) => {
                            setDeactivatingItem(item);
                            formik.setValues(item);
                            setIsModalOpenDeact(true);
                        }}
                        onActivate={(item) => {
                            setActivatingItem(item);
                            formik.setValues(item);
                            setIsModalOpenAct(true);
                        }}
                    />
                </div>

                {/* Modals */}
                <FormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={formik.handleSubmit}
                    formik={formik}
                    fields={fields}
                    title={`Editar ${entityName}`}
                    txtBtn="Guardar cambios"
                />

                <FormModal
                    isOpen={isModalOpen2}
                    onClose={() => setIsModalOpen2(false)}
                    onSubmit={formik.handleSubmit}
                    formik={formik}
                    fields={fields}
                    title={`Agregar nuevo ${entityName}`}
                    txtBtn="Crear"
                />

                <FormModal
                    isOpen={isModalOpenDeact}
                    onClose={() => setIsModalOpenDeact(false)}
                    onSubmit={formik.handleSubmit}
                    formik={formik}
                    fields={fields}
                    disabled
                    title={`Desactivar ${entityName}`}
                    txtBtn="Desactivar"
                />

                <FormModal
                    isOpen={isModalOpenAct}
                    onClose={() => setIsModalOpenAct(false)}
                    onSubmit={formik.handleSubmit}
                    formik={formik}
                    fields={fields}
                    disabled
                    title={`Activar ${entityName}`}
                    txtBtn="Activar"
                />
            </div>
        </div>
    );
}

export default EntityPage
