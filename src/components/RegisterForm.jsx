import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import axios from "axios"

const schema = yup.object().shape({
    nombre_completo: yup.string().min(3, 'Minimo 3 caracteres').required('El nombre es requerido'),
    correo_electronico: yup.string().email('Correo invalido, debe de seguir usuario@dominio.com').required('El correo electronico es requerido'),
    contrasenia: yup.string().min(8, 'Contraseña muy corta - Debe de tener almenos 8 caracteres').required('La contraseña es obligatoria'),
    telefono: yup.string().length(8, 'El numero debe de contener 8 digitos').matches(/^[0-9]+$/, 'Solo se permiten números').required('El telefono es requerido'),
    fecha_nacimiento: yup.date().max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Debes tener almenos 18 años para registrarte').required('La fecha de nacimiento es requerida').transform((value) => (value ? new Date(value) : null))
})

const RegisterForm = ({ onSuccess, onClick, textBottom }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        try {
            const token =
                await axios.post('http://localhost:1234/api/users', data)
            alert('Usuario registrado con éxito')
            onSuccess();
        } catch (error) {
            console.error('Error al registrar usuario:', error)
            alert('Hubo un error al registrar el usuario')
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Registrarse</h2>

            <div className="space-y-4">
                {/* Nombre completo */}
                <div>
                    <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="nombre_completo"
                        {...register('nombre_completo')}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.nombre_completo ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        placeholder="Nombre completo"
                    />
                    {errors.nombre_completo && <p className="text-red-500 text-sm mt-1">{errors.nombre_completo.message}</p>}
                </div>

                {/* Correo electrónico */}
                <div>
                    <label htmlFor="correo_electronico" className="block text-sm font-medium text-gray-700">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="correo_electronico"
                        {...register('correo_electronico')}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.correo_electronico ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        placeholder="ejemplo@correo.com"
                    />
                    {errors.correo_electronico && <p className="text-red-500 text-sm mt-1">{errors.correo_electronico.message}</p>}
                </div>

                {/* Contraseña */}
                <div>
                    <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="contrasenia"
                        {...register('contrasenia')}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.contrasenia ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        placeholder="********"
                    />
                    {errors.contrasenia && <p className="text-red-500 text-sm mt-1">{errors.contrasenia.message}</p>}
                </div>

                {/* Teléfono */}
                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        id="telefono"
                        {...register('telefono')}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        placeholder="12345678"
                    />
                    {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                    <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
                        Fecha de Nacimiento
                    </label>
                    <input
                        type="date"
                        id="fecha_nacimiento"
                        {...register('fecha_nacimiento')}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                    />
                    {errors.fecha_nacimiento && <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento.message}</p>}
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 mt-4"
            >
                Registrarse
            </button>
            <div className="text-center mt-4">
                <a
                    onClick={onClick}
                    className="text-sm text-green-600 hover:text-green-700 hover:underline transition duration-200"
                >
                    {textBottom}
                </a>
            </div>

        </form>
    );
};

export default RegisterForm