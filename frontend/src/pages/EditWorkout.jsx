import {useEffect, useState} from "react"
import {useNavigate, useLocation} from "react-router-dom"
import axios from "axios"

function EditWorkout() {
    const loc = useLocation();
    const navigate = useNavigate();
    const {workout} = loc.state || {};
    const [formData, setFormData] = useState(workout || {title:"", exercises:[], cardio: {}});
    useEffect(() => {
        if (!workout) {
            navigate("/dashboard");
        }
    }, [workout, navigate]);

    const change = (e, index) => {
        const {name, value} = e.target;
        const exercises = [...formData.exercises];
        exercises[index][name] = value;
        setFormData({...formData, exercises});
    };

    const cardioChange = (e) => {
        const {name,value} = e.target;
        setFormData({...formData, cardio: {...formData.cardio, [name]: value}});
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/workouts/date/${workout.date}`, formData, {headers: {"x-auth-token": token},});
            alert("Workout updated");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Couldnt update workout");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Edit Workout</h2>
            <form onSubmit={submit}>
                <div className="mb-3">
                    <label className="form-label">Workout Title</label>
                    <input type="text" name="title" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                {formData.exercises.map((exercise, index) => (
                    <div key={index} className="border p-3 mb-2">
                        <label className="form-label">Exercise Name</label>
                        <input type="text" name="name" className="form-control" value={exercise.name} onChange={(e) => change(e, index)} required />
                        <label className="form-label">Sets</label>
                        <input type="number" name="sets" className="form-control" value={exercise.sets} onChange={(e) => change(e, index)} required />
                        <label className="form-label">Reps</label>
                        <input type="number" name="reps" className="form-control" value={exercise.reps} onChange={(e) => change(e, index)} required />
                        <label className="form-label">Weight (lbs)</label>
                        <input type="number" name="weight" className="form-control" value={exercise.weight} onChange={(e) => change(e, index)} required />
                    </div>
                ))}
                <h5>Cardio (Optional)</h5>
                <label className="form-label">Cardio Type</label>
                <input type="text" name="type" className="form-control" value={formData.cardio.type} onChange={cardioChange} />
                <label className="form-label">Duration (Mins)</label>
                <input type="number" name="duration" className="form-control" value={formData.cardio.duration} onChange={cardioChange} />
                <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
            </form>
        </div>
    );
}

export default EditWorkout;