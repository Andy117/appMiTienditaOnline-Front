import React from "react"
import { useAuth } from "../context/AuthContext"
import LoginForm from "../components/LoginForm"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"

const decodeBase64 = (str) => {
    // Replace characters for Base64 decoding
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if necessary
    while (str.length % 4) {
        str += '=';
    }
    return JSON.parse(atob(str));
};

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (data) => {
        try {
            const response = await authService.login(data)
            const token = response.data.token

            login(token)

            const decodedToken = decodeBase64(token.split('.')[1])
            console.log(decodedToken)
            navigate(decodedToken.rol_id === 1 ? '/operador' : '/cliente')
        } catch (error) {
            console.error('Error al iniciar sesion...', error.response?.data?.message || 'Ocurrio un error...')
            alert('Credenciales incorrectas o problemas en el servidor.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <LoginForm onSubmit={handleSubmit}/>
        </div>
    )
}

export default Login