import React, { useState } from 'react';
import API from '../api/api';

export default function AddCourse({ onCreated }){
    const [title, setTitle] = useState('');
    const [instructor, setInstructor] = useState('');
    const[creditHours, setCreditHours] = useState(3);
    const [error, setError] = useState(null);

    const sumbit = async (e) => {
        e.preventDafault();
        try {
            const res = await API.post('/courses/create', { title, instructor, creditHours });
            setTitle(''); setInstructor(''); setCreditHours(3);
            if (onCreated) onCreated(res.data); 
        } catch (err) {
            setError (err?.response?.data?.error || 'Error creating course');
        }
    };

    return (
        <from onSubmit={submit}>
            <h3> Add Course</h3>
            <div>
                <label>Title</label>
                <input value={title} onCharge={e=>setTitle(e.target.value)} required/>
            </div>
            <div>
                <label>Instructor</label>
                <input value={instructor} onChange={e=>setInstructor(e.target.value)}/>
            </div>
            <div>
                <label>Credit Hours</label>
                <input type="number" value={creditHours} onChange={e=>setCreditHours(e.target.value)}/>
            </div>
            <button type="submit">Add</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </from>
    );
}