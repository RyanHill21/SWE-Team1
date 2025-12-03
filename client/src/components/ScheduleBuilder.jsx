import React, { useEffect, useState } from 'react';
import API from '../api/api';
import EditSessionModal from './EditSessionModal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function ScheduleBuilder() {
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEdit, setShowEdit] = useState(false);
    const [editing, setEditing] = useState(null);


    useEffect(()=> {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try{
        const res = await API.get('/courses');
        setCourses(res.data);
        } catch (err){
            console.error("Failed to load course", err); 
        }
    };

    useEffect(()=> {
        fetchSessions(selectedDate);
    }, [selectedDate]);

    const fetchSessions = async (date) => {
        try{
        const formatted = date.toISOString().slice(0, 10);
        const res = await API.get(`/sessions?date=${formatted}`);
        setCourses(res.data);
        } catch (err){
            console.error("Failed to load course", err); 
        }
    };

    const openEdit = (session) => {
        setEditing(session);
        setShowEdit(true);
    };

    return (
        <div style={{ padding: 20}}>
            <h2>Schedule Builder</h2>

            <div style={{display:'flex', gap: 30, marginTop: 20 }}>

                {/* LEFT COLUMN - COURSES */}
                <div style={{flex:1, borderRight: "1px solid #ccc", paddingRight: 20 }}>
                    <h4>Courses</h4>
                    <ul>
                        {courses.map(c => (
                            <li key={c._id}>{c.title}</li>
                        ))}
                    </ul>
                </div>

                {/*RIGHT COLUMN - SESSIONS BY DAY */}

                <div style={{flex:2}}>
                    <label>Choose Day:</label>
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={d=>setSelectedDate(d)} 
                    />


                    <h5 style={{ marginTop: 20 }}>
                        Session on {selectedDate.toDateString()}
                    </h5>

                    {sessions.length ===0 ? (
                        <p>No sessions scheduled.</p>
                    ) : (
                    <ul>
                        {sessions.map(s => (
                            <li key={s._id} style={{ marginBottom: 10 }}>
                                <strong> {s.courseId?.title || 'No course'}</strong> - {s.topic || 'No topic'}
                                <br />
                                {new Date(s.startTime).toLocaleTimeString()} to {new Date(s.endTime).toLocaleTimeString()}
                                <button style={{ marginLeft: 10 }}onClick={()=>openEdit(s)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>

                    {/*EDIT MODAL*/}
                    {showEdit && (
                        <EditSessionModal session = {editing} onClose={() => {
                            setShowEdit(false);
                            fetchSessions(selectedDate);
                        }}/>
                    )}
                 </div>
    );

}