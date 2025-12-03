import { useState } from "react";
import { createSession } from "../api";

export default function SessionForm({ onCreated }) {
    const [form, setForm] = useState({
        courseId: "",
        startTime: "",
        endTime: "",
        difficulty: 1
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await createSession(form);
        onCreated(res.data.data);
        setForm({ courseId: "", startTime: "", endTime: "", difficulty: 1 });
    } catch (err) {
        alert(err.response?.data?.message || "Failed to create session");
    }


return (
    <form onSubmit={handleSubmit} style={styles.box}>
        <h2>Create Study Session</h2>

        <input
            name="courseId"
            placeholder="Course ID"
            value={form.courseId}
            onChange={handleChange}
            required
            />

        <label>Start Time</label>
        <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
        />

        <label>End Time</label>
        <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
        />

        <label>Difficulty (-5)</label>
        <input
            type="number"
            name="difficulty"
            min="1"
            max="5"
            value={form.difficulty}
            onChange={handleChange}
            required
        />

        <button type="submit">Add Session</button>
    </form>
);

}

const styles = {
    box: {
        padding: "20px",
        borderRadius: "1px solid #ccc",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    }
};