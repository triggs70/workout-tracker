import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
    const [formData, setFormData] = useState({email:"", password:""});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const input = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        console.log("Submit triggered");
        try {
            console.log("Sending login request with:", formData);
            const res = await axios.post("http://localhost:5000/api/auth/login", formData);
            console.log("Response received:", res.data);
            localStorage.setItem("token", res.data.token);
            console.log("Token stored:", localStorage.getItem("token"));
            navigate('/dashboard');
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.msg || "Invalid email or password");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
            <div className="card p-4 shadow-lg" style={{width: "400px"}}>
                <h2 className="text-center mb-4">Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={input} required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={input} required/>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;