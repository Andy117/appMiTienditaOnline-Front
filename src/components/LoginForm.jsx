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
    } = useForm ({
        resolver: yupResolver(schema)
    })
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="">Correo Electronico:</label>
                <input type="email" {...register("email")}/>
                <p>{errors.email?.message}</p>
            </div>
            <div>
                <label htmlFor="">Contraseña:</label>
                <input type="password" { ...register("password")}/>
                <p>{errors.password?.message}</p>
            </div>
            <button type="submit">Iniciar Sesión</button>
        </form>
    )
}

export default LoginForm