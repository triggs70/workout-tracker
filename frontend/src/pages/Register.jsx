import { useState } from "react"
import { useNavigate} from "react-router-dom"
import axios from "axios"

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const input = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData);
            localStorage.setItem("token", res.data.token);
            navigate("/login");
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.map(error => error.msg).join(", "));
            } else {
                setError(err.response?.data?.msg || "Couldnt register user");
            }
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
            <div className="card p-4 shadow-lg" style={{width: "400px"}}>
                <h2 className="text-center mb-4">Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={input} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={input} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={input} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;