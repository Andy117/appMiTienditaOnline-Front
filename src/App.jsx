import './App.css'
import './index.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/LoginPage.jsx'
import HomeCliente from './pages/HomeCliente.jsx'
import OperatorDashboard from './components/OperatorDashboard.jsx'
import OrderDetails from './components/OrderDetails.jsx'
import ProductTable from './components/ProductOperator.jsx'
import AgregarProducto from './pages/AgregarProducto.jsx'
import CategoriasProducto from './pages/CategoriasProducto.jsx'
import MarcasProducto from './pages/MarcasProducto.jsx'
import UnidadesMedida from './pages/UnidadesMedida.jsx'
import PresentacionProducto from './pages/PresentacionProducto.jsx'
import EditarProducto from './pages/EditarProducto.jsx'
import ClientesAdmin from './pages/ClientesAdmin.jsx'
import UsersAdmin from './pages/UsersAdmin.jsx'

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
          <Route path='/inicio' element={
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
          <Route path='/categorias' element={
            <ProtectedRoute roles={[1]}>
              <CategoriasProducto />
            </ProtectedRoute>
          } />
          <Route path='/marcas' element={
            <ProtectedRoute roles={[1]}>
              <MarcasProducto />
            </ProtectedRoute>
          } />
          <Route path='/unidadesmedida' element={
            <ProtectedRoute roles={[1]}>
              <UnidadesMedida />
            </ProtectedRoute>
          } />
          <Route path='/presentaciones' element={
            <ProtectedRoute roles={[1]}>
              <PresentacionProducto />
            </ProtectedRoute>
          } />
          <Route path='/EditarProducto/:id' element={
            <ProtectedRoute roles={[1]}>
              <EditarProducto />
            </ProtectedRoute>
          } />
          <Route path='/clientes' element={
            <ProtectedRoute roles={[1]}>
              <ClientesAdmin />
            </ProtectedRoute>
          } />
          <Route path='/usuarios' element={
            <ProtectedRoute roles={[1]}>
              <UsersAdmin />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
