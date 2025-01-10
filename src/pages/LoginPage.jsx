import React, { useState } from "react"
import { useAuth } from "../context/AuthContext"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"

const decodeBase64 = (str) => {

    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return JSON.parse(atob(str));
};

const Login = () => {
    const [showRegister, setShowRegister] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (data) => {
        try {
            const response = await authService.login(data)
            const token = response.data.token

            login(token)

            const decodedToken = decodeBase64(token.split('.')[1])
            console.log(decodedToken)
            navigate(decodedToken.rol_id === 1 ? '/inicio' : '/cliente')
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado.'

            console.error('Error al iniciar sesión:', errorMessage)
            alert(errorMessage)
        }
    }

    const handleRegistrationSuccess = () => {
        setShowRegister(false)
        alert('Registro exitoso. Ahora puedes iniciar sesion.')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg">
                {showRegister ? (
                    <RegisterForm onSuccess={handleRegistrationSuccess}
                        textBottom={showRegister ? 'Ya tienes cuenta? Inicia sesion' : 'No tienes cuenta? - Registrate :D'}
                        onClick={() => setShowRegister(!showRegister)}
                    />
                ) : (
                    <LoginForm onSubmit={handleSubmit}
                        textBottom={showRegister ? 'Ya tienes cuenta? Inicia sesion' : 'No tienes cuenta? - Registrate :D'}
                        onClick={() => setShowRegister(!showRegister)}
                    />
                )}
            </div>
        </div>
    )
}

export default Login