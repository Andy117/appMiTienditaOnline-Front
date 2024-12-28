import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth()

    if(!user) return <Navigate to='/login' replace/>

    if(roles && !roles.includes(user.rol_id)){
        return <Navigate to={user.rol_id === 1 ? "/operador" : "/cliente"} replace />;
    }

    return <>{children}</>
}

export default ProtectedRoute