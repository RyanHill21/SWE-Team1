import React, { useEffect, useState } from 'react';
import API from '../api/api';
import EditSessionModal from './EditSessionModal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function ScheduleBuilder() {
    const [courses, setCourses] = useState([]);
    const [session, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEdit, setShowEdit] = useState(false);
    const [editing, setEditing] = useState(null);


    useEffect(()=> {
        fetchCourses();
        fetchSession();
        
    }, []);

    const fetchCourses = async (date) => {
        const q = date ? '?date=${date.toISOString().slice(0,10)}' : '';
        const res = await API.get('/sessions' + q);
        setSessions(res.data);
    };

    useEffect(()=> {
        fetchSessions(selectedDate);
    }, [selectedDate]);

    const openEdit = (session) => {
        setEditing(session);
        setShowEdit(true);
    };

    return (
        <div>
            <h2>Schedule Builder</h2>

            <div style={{display:'flex', gap: 20}}>
                <div style={{flex:1}}>
                    <h4>Courses</h4>
                    <ul>
                        {courses.map(c => <li key={c._id}>{c.title}</li>)}
                    </ul>
                </div>

                <div style={{flex:2}}>
                    <h4>Calendar</h4>
                    <label>Choose day:</label><br/>
                    <DatePicker selected={selectedDate} onChange={d=>setSelectedDate(d)} />
                    <h5>Session on {selectedDate.toDateString()}</h5>
                    <ul>
                        {sessionStorage.map(s => (
                            <li key={s._id}>
                                {s.courseId?.title || 'No course'} - {s.topic || 'No topic'} -
                                {new Date(s.startTime).toLocaleTimeString()} to {new Date(s.endTime).toLocaleTimeString()}
                                <button onClick={()=>openEdit(s)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

                    {showEdit && <EditSessionModal session={editing} onClose={()=> { setShowEdit(false); fetchSessions(selectedDate); }} />}
                 </div>
    );

}