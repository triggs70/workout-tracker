import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <Link className="navbar-brand fw-bold" to="/">Tylers Workout Tracker</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/add-workout">Add Workout</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
        </ul>
      </div>
      <button className="btn btn-danger" onClick={logout}>Log out</button>
    </nav>
  );
}

export default Navbar;