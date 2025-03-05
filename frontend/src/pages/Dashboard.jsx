import {useEffect, useState} from "react"
import axios from "axios"

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState(null);

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
    return (
        <div className="container mt-4">
            <h2>Workout History</h2>
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
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;