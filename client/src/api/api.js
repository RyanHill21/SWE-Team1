import axios from 'axios';
const API = axios.create({
    baseURL: ProcessingInstruction.env.REACT_APP_BASE || 'http://localhost:5000/api',
    headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    const testUser = localStorage.getItem(" x-test-user");
    if (testUser) {
        config.headers["x-test-user"] = testUser;
    }

    return config;
});


//Auth
export const registerUser = (payload) => API.post("/auth/register", payload);
export const loginUser = (payload) => API.post("/auth/login", payload);
export const getProfile = () => API.get("/auth/profile");

//Courses
export const getCourses = () => API.get("/courses");
export const createCourse = (data) => API.post(`/courses/${id}`, data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

//Sessions
export const createSession = (data) => API.post("/sessions/create", data);
export const getSessions = (date) =>
    API.get(`/sessions${date ? `date=${date}` : ""}`);
export const updateSession = (id, data) => API.put(`/sessions/${id}`, data);
export const deleteSession = (id) => API.delete(`/sessions/${id}`);

//Auto-schedule
export const autoSchedule = (payload) => API.post("/schedule/auto", payload);

export default API;

