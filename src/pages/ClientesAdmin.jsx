import React from "react"
import EntityPage from "../components/EntityPage"
import * as Yup from 'yup'
import AdminHeader from "../components/AdminHeader"

const ClientesAdmin = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <AdminHeader
                    h1='Panel de Control - Operador'
                    span='Panel de administracion de: Clientes'
                />
                <EntityPage
                    entityName='Clientes'
                    apiUrl='http://localhost:1234/api/clients'
                    fields={[
                        {
                            name: 'razon_social',
                            label: 'Razon Social',
                            validation: Yup.string().min(3).max(50).required('Campo obligatorio')
                        },
                        {
                            name: 'nombre_comercial',
                            label: 'Nombre Comercial',
                            validation: Yup.string().min(3).max(100).required('Campo obligatorio')
                        },
                        {
                            name: 'direccion_entrega',
                            label: 'Direccion de Entrega',
                            validation: Yup.string().min(3).max(100).required('Campo obligatorio')
                        },
                        {
                            name: 'telefono_cliente',
                            label: 'Telefono del Cliente',
                            validation: Yup.string().length(8, 'La longitud del telefono es de 8 digitos...').required('Campo obligatorio')
                        },
                        {
                            name: 'email_cliente',
                            label: 'Correo electronico del Cliente',
                            validation: Yup.string().email('El formato debe de ser de correo electronico').required('Campo obligatorio')
                        },
                        {
                            name: 'Estados_idEstados',
                            label: 'Estado',
                            validation: Yup.number().oneOf([1, 2], 'El estado debe de ser 1=Activo o 2=Inactivo - En construccion').optional()
                        }
                    ]}
                    keyID='idClientes'
                    type='client'
                />
            </div>
        </div>

    )
}

export default ClientesAdmin