import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AddWorkout from "./pages/AddWorkout"
import Nutrition from "./pages/Nutrition"
import Progress from "./pages/Progress"
import Navbar from "./components/Navbar"
import Protected from "./components/ProtectedRoute"
import EditWorkout from "./pages/EditWorkout"

function App() {
  return (
    <div>
      <Navbar /> {/* Nav Bar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/add-workout" element={<Protected><AddWorkout /></Protected>} />
        <Route path="/nutrition" element={<Protected><Nutrition /></Protected>} />
        <Route path="/progress" element={<Protected><Progress /></Protected>} />
        <Route path="/edit-workout" element={<Protected><EditWorkout /></Protected>} />
      </Routes>
    </div>
  );
}

export default App
