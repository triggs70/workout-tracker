import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const logged = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/workouts", {headers: {"x-auth-token": token},});
                setWorkouts(res.data);
            } catch (err) {
                setError("Couldnt load previously saved workouts");
            }
        };
        logged();
    }, []);

    const deleteWorkout = async (date) => {
        if (!window.confirm("Are you sure you want to delete this workout?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/workouts/date/${date}`, {headers: {"x-auth-token": token},});
            const res = await axios.get("http://localhost:500/api/workouts", {headers: {"x-auth-token": token},});
            setWorkouts(res.data);
        } catch (err) {
            setError("Failed to delete workout");
        }
    };

    const editWorkout = (workout) => {
        navigate("/edit-workout", {state: {workout}});
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items center mb-3">
                <h2>Workout History</h2>
                <button className="btn btn-primary" onClick={() => navigate("/add-workout")}>Add a Workout</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <ul className="list-group">
                {workouts.map((workout) => (
                    <li key={workout._id} className="list-group-item">
                        <h4>{workout.title} - {new Date(workout.date).toDateString()}</h4>
                        {workout.exercises.map((ex, i) => (
                            <p key={i}>{ex.name}: {ex.sets} sets x {ex.reps} reps @ {ex.weight} lbs</p>
                        ))}
                        {workout.cardio.type && (
                            <p>Cardio: {workout.cardio.type} - {workout.cardio.duration} mins</p>
                        )}
                        <button className="btn btn-danger me-2" onClick={() => deleteWorkout(workout.date)}>Delete Workout</button>
                        <button className="btn btn-warning" onClick={() => editWorkout(workout)}>Edit Workout</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;