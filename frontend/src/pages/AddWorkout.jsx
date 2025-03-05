import {useState} from "react"
import axios from "axios"

function AddWorkout() {
    const [formData, setFormData] = useState({title:"", exercises: [{name:"", sets:"", reps:"", weight:""}], cardio: {type:"", duration:""}});
    const [error, setError] = useState(null);
    const change = (e, index) => {
        const {name, value} = e.target;
        const exercises = [...formData.exercises];
        exercises[index][name] = value;
        setFormData({...formData, exercises});
    };
    const addExer = () => {
        setFormData({...formData, exercises: [...formData.exercises, {name:"", sets:"", reps:"", weight:""}],});
    };
    const cardioChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, cardio: {...formData.cardio, [name]: value}});
    };
    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/workouts", formData, {headers: {"x-auth-token": token},});
            alert("Workout logged successfully");
        } catch (err) {
            setError("Failed to log workout");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Log Workout</h2>
            {error && <p className="text-danger">{error}</p>}
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
                        <label className="form-label">Weight</label>
                        <input type="number" name="weight" className="form-control" value={exercise.weight} onChange={(e) => change(e, index)} required />
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addExer}>Add Another Exercise</button>

                <div className="mt-4">
                    <h5>Cardio (Optional)</h5>
                    <label className="form-label">Type</label>
                    <input type="text" name="type" className="form-control" value={formData.cardio.type} onChange={cardioChange} />
                    <label className="form-label">Duration</label>
                    <input type="number" name="duration" className="form-control" value={formData.cardio.duration} onChange={cardioChange} />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Log Workout</button>
            </form>
        </div>
    );
}

export default AddWorkout;