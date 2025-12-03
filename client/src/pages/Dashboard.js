import CourseForm from "../components/CourseForm";
import CourseList from "../components/SessionList";

export default function Dashboard() {
    return (
        <div>
            <h1> Study Schedule Dashboard</h1>
            <CourseForm onCourseCreated={() => window.location.reload()} />
            <CourseList />
        </div>
    );
}