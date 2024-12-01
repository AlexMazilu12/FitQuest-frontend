import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutService } from "../services/WorkoutService";
import { useAuth } from "../services/AuthProvider.jsx";


const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workout, setWorkout] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchWorkouts();
    }
  }, [isAuthenticated, navigate]);

  const fetchWorkouts = async () => {
    try {
      const data = await WorkoutService.getAllWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout({ ...workout, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update workout
        await WorkoutService.updateWorkout(editId, workout);
        setIsEditing(false);
        setEditId(null);
      } else {
        // Create new workout
        await WorkoutService.createWorkout(workout);
      }
      // Reset form and refresh workouts
      setWorkout({ title: "", description: "" });
      fetchWorkouts();
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const handleEdit = (id, workout) => {
    setWorkout(workout);
    setIsEditing(true);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await WorkoutService.deleteWorkout(id);
      fetchWorkouts();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  return (
    <div>
      <h1>Workout Page</h1>

      {/* Form for Creating/Editing Workouts */}
      <div>
        <h2>{isEditing ? "Edit Workout Plan" : "Create Workout Plan"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={workout.title}
              onChange={handleChange}
              placeholder="Enter workout title"
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={workout.description}
              onChange={handleChange}
              placeholder="Enter workout description"
            />
          </div>
          <button type="submit">{isEditing ? "Update" : "Create"}</button>
        </form>
      </div>

      {/* List of Workouts */}
      <div>
        <h2>Workout Plans</h2>
        {workouts.length > 0 ? (
          <ul>
            {workouts.map((w) => (
              <li key={w.id}>
                <strong>{w.title}</strong> - {w.description}
                <button onClick={() => handleEdit(w.id, { title: w.title, description: w.description })}>
                  Edit
                </button>
                <button onClick={() => handleDelete(w.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No workouts available. Start by creating one!</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;
