import React from "react"
import EntityPage from "../components/EntityPage"
import * as Yup from 'yup'
import AdminHeader from "../components/AdminHeader"

const UsersAdmin = () => {
    const apiURL = import.meta.env.VITE_API_URL
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <AdminHeader
                    h1='Panel de Control - Operador'
                    span='Panel de administracion de: Usuarios'
                />
                <EntityPage
                    entityName='Usuario'
                    apiUrl={`${apiURL}/api/users`}
                    fields={[
                        {
                            name: 'nombre_completo',
                            label: 'Nombre Completo',
                            validation: Yup.string().min(3).max(100).required('Campo obligatorio')
                        },
                        {
                            name: 'correo_electronico',
                            label: 'Correo electronico',
                            validation: Yup.string().min(3).max(100).required('Campo obligatorio')
                        },
                        {
                            name: 'telefono',
                            label: 'Telefono del Usuario',
                            validation: Yup.string().length(8, 'La longitud del telefono es de 8 digitos...').matches(/^[0-9]+$/, 'Solo se permiten números').required('Campo obligatorio')
                        },
                        {
                            name: 'rol_idRol',
                            label: 'Rol dentro del sistema',
                            validation: Yup.number().optional().nullable()
                        },
                        {
                            name: 'estados_idEstados',
                            label: 'Estado dentro del sistema',
                            validation: Yup.number().optional().nullable()
                        },
                        {
                            name: 'contrasenia',
                            label: 'Contraseña',
                            type: 'password',
                            validation: Yup.string().min(8, 'La contraseña debe de tener almenos 8 caracteres').required()
                        },
                        {
                            name: 'fecha_nacimiento',
                            label: 'Fecha de nacimiento',
                            type: 'date',
                            validation: Yup.date().max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Debes tener almenos 18 años para registrarte').required('La fecha de nacimiento es requerida').transform((value) => (value ? new Date(value) : null))
                        }
                    ]}
                    keyID='idUsuarios'
                    type='user'
                />
            </div>
        </div>

    )
}

export default UsersAdmin