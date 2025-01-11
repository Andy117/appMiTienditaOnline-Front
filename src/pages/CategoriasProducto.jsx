import React from "react"
import EntityPage from "../components/EntityPage"
import * as Yup from 'yup'
import AdminHeader from "../components/AdminHeader"

const CategoriasProducto = () => {
    const apiURL = import.meta.env.VITE_API_URL
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <AdminHeader
                    h1='Panel de Control - Operador'
                    span='Panel de administracion de: Categorias'
                />
                <EntityPage
                    entityName='Categoria'
                    apiUrl={`${apiURL}/api/categories`}
                    fields={[
                        {
                            name: 'nombre_categoria',
                            label: 'Nombre de la Categoria',
                            validation: Yup.string().min(3).max(50).required('Campo obligatorio')
                        },
                        {
                            name: 'estados_idEstados',
                            label: 'Estado',
                            validation: Yup.number().oneOf([1, 2], 'El estado debe de ser 1=Activo o 2=Inactivo - En construccion').optional()
                        }
                    ]}
                    keyID='idCategoriaProductos'
                    type='categories'
                />
            </div>
        </div>

    )
}

export default CategoriasProducto