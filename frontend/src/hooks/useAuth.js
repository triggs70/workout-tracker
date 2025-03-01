import { useState, useEffect } from "react"

function useAuth() {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
    useEffect(() => {
        const check = () => setIsAuth(!!localStorage.getItem("token"));
        window.addEventListener("storage", check);
        return () => window.removeEventListener("storage", check);
    }, []);
    return isAuth;
}

export default useAuth;