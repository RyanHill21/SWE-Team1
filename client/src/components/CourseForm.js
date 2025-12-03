import { useState } from "react";
import { createCourse } from "../api/api";

export default function CourseForm({ onCourseCreated }){
    const [title, setTitle] = useState("");
    const[instructor, setInstructor] = useState("");
    const[creditHours, setCreditHours] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCourse = await creditCourse({ title, instructor, creditHours });
        onCourseCreated(newCourse);
        setTitle("");
        setInstructor("");
        setCreditHours(0);
    };

    return(
        <form on Submit={handleSubmit}>
            <input
            type="text"
            placeholder="Course Title"
            value={title}
            onCharge={(e) => setTitle(e.target.value)}
            required
            />
            <input
            type="text"
            placeholder="Instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            />
            <input
            type="number"
            placeholder="Credit Hours"
            value={creditHours}
            onChange={(e) => setCreditHours(Number(e.target.value))}
            />
            <button type="submit"> Add Course</button>
        </form>
    );
}