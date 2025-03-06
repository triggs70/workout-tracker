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
        <div className="container d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
            <div className="card p-4 shadow-lg" style={{width: "450px"}}>
                <h2 className="text-center mb-4">Log Workout</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Workout Title</label>
                        <input type="text" name="title" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <h5 className="text-center">Exercises</h5>
                    {formData.exercises.map((exercise, index) => (
                        <div key={index} className="mb-3">
                            <input type="text" name="name" className="form-control mb-2" placeholder="Exercise Name" value={exercise.name} onChange={(e) => change(e, index)} required />
                            <input type="number" name="sets" className="form-control mb-2" placeholder="Sets" value={exercise.sets} onChange={(e) => change(e, index)} required />
                            <input type="number" name="reps" className="form-control mb-2" placeholder="Reps" value={exercise.reps} onChange={(e) => change(e, index)} required />
                            <input type="number" name="weight" className="form-control mb-2" placeholder="Weight (lbs)" value={exercise.weight} onChange={(e) => change(e, index)} required />
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary w-100 mb-3" onClick={addExer}>Add Exercise</button>
                    <h5 className="text-center">Cardio (Optional)</h5>
                    <input type="text" name="type" className="form-control mb-2" placeholder="Cardio Type" value={formData.cardio.type} onChange={cardioChange}/>
                    <input type="number" name="duration" className="form-control mb-3" placeholder="Duration (mins)" value={formData.cardio.duration} onChange={cardioChange}/>
                    <button type="submit" className="btn btn-primary w-100">Log Workout</button>
                </form>
            </div>
        </div>
    );
}

export default AddWorkout;