import React from "react"
import { LayoutGrid, Package, Tags, Building2, Ruler, UserCircle, House } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import Header from "./Header"

const AdminHeader = ({ h1, span }) => {
    const navigate = useNavigate()

    const actions = [
        { label: 'Inicio', onClick: () => navigate('/inicio'), icon: House, title: 'Titulo prueba house' },
        { label: 'Productos', onClick: () => navigate('/productos'), icon: Package },
        { label: 'Categorias', onClick: () => navigate('/categorias'), icon: LayoutGrid },
        { label: 'Marcas', onClick: () => navigate('/marcas'), icon: Tags },
        { label: 'Unidades de Medida', onClick: () => navigate('/unidadesmedida'), icon: Ruler },
        { label: 'Presentaciones', onClick: () => navigate('/presentaciones'), icon: Building2 },
        { label: 'Usuarios', onClick: () => navigate('/usuarios'), icon: UserCircle }
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    return (
        <div>
            <Header title={h1} subtitle={span} actions={actions} onLogOut={handleLogout} />
        </div>
    )
}

export default AdminHeader