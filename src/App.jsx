import './App.css'
import './index.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/LoginPage.jsx'
import HomeCliente from './pages/HomeCliente.jsx'
import HomeOperador from './pages/HomeOperador.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cliente' element={
            <ProtectedRoute roles={[2]}>
              <HomeCliente />
            </ProtectedRoute>
          } />
          <Route path='/operador' element={
            <ProtectedRoute roles={[1]}>
              <HomeOperador />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
