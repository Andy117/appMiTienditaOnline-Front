import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'

const schema = yup.object().shape({
    email: yup.string().email('Correo invalido...').required('El correo es requerido...'),
    password: yup.string().min(8, 'El minimo requerido son 8 caracteres').required('Contraseña requerida')
})

const LoginForm = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Iniciar Sesión</h2>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.email
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-green-500'
                            } focus:outline-none focus:ring-2 transition duration-200`}
                        placeholder="ejemplo@correo.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register("password")}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.password
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-green-500'
                            } focus:outline-none focus:ring-2 transition duration-200`}
                        placeholder="********"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                >
                    Iniciar Sesión
                </button>

                <div className="text-center">
                    <a
                        href="/recuperar-contrasena"
                        className="text-sm text-green-600 hover:text-green-700 hover:underline transition duration-200"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </div>
        </form>
    );

};

export default LoginForm