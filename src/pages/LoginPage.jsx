import React from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService.js"
import LoginForm from '../components/LoginForm.jsx'

const LoginPage = () => {
    const navigate = useNavigate()

    const handleLogin = async (data) => {
        try {
            const response = await authService.login(data)
            localStorage.setItem('token', response.data.token)
            navigate('/dashboard')
        } catch (error) {
            console.error('Error al iniciar sesion....', error.response?.data?.message || error.message)
        }
    }

    return (
        <div>
            <h1>Iniciar Sesion</h1>
            <LoginForm onSubmit= {handleLogin}/>
        </div>
    )
}

export default LoginPage