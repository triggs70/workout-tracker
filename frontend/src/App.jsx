import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AddWorkout from "./pages/AddWorkout"
import Nutrition from "./pages/Nutrition"
import Progress from "./pages/Progress"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div>
      <Navbar /> {/* Nav Bar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-workout" element={<AddWorkout />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </div>
  );
}

export default App
