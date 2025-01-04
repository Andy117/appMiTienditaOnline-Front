import './App.css'
import './index.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/LoginPage.jsx'
import HomeCliente from './pages/HomeCliente.jsx'
import HomeOperador from './pages/HomeOperador.jsx'
import OperatorDashboard from './components/OperatorDashboard.jsx'
import OrderDetails from './components/OrderDetails.jsx'
import ProductTable from './components/ProductOperator.jsx'
import AgregarProducto from './components/AgregarProducto.jsx'

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
              <OperatorDashboard />
            </ProtectedRoute>
          } />
          <Route path='/orders/:orderId' element={
            <ProtectedRoute roles={[1]}>
              <OrderDetails />
            </ProtectedRoute>
          } />
          <Route path='/productos' element={
            <ProtectedRoute roles={[1]}>
              <ProductTable />
            </ProtectedRoute>
          } />
          <Route path='/AgregarProducto' element={
            <ProtectedRoute roles={[1]}>
              <AgregarProducto />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
