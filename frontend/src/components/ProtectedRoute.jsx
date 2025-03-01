import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function Protected({children}) {
    const isAuth = useAuth();
    return isAuth ? children : <Navigate to="/login" />
}

export default Protected;