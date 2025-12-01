import React, { useState } from 'react';
import API from '../api/api';

export default function EditSessionModal({ session, onClose }) {
    const [topic, setTopic] = useState(session.topic || '');
    const [startTime, setStartTime] = useState(new Date(session.startTime).toISOString().slice(0,16));
    const [endTime, setEndTime] = useState(new Date(session.endTime).toISOString().slice(0,16));
    const [difficulty, setDifficulty] = useState(session.difficulty || 5);
    const [error, setError] = useState(null);

    const save = async () => {
        try {
            const res = await API.put(`/sessions/${session._id}`, {
                topic,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                difficulty
            });
            onClose();
        } catch (err) {
            setError(err?.response?.data?.error || 'Error saving session');

        }
    };

    const remove = async () => {
        try {
            await API.delete(`/session/${session._id}`);
            onClose();
        } catch (err) {
            setError('Error deleting session');
        }
    };


    return (
        <div style={{position:'fixed', top:100,left:200, padding:20, padding:20, background:'white', border:'1px solid #ccc'}}>
            <h3>Edit Session</h3>
            <div>
                <label>Topic</label>
                <input value={topic} onChange={e=>setTopic(e.target.value)} />
            </div>
            <div>
                <label>Start</label>
                <input type="datetime-local" value={startTime} onCharge={e=>setStartTime(e.target.value)} />
            </div>
            <div>
                <label>End</label>
                <input type="datetime-local" value={endTime} onChange={e=>setEndTime(e.target.value)} />
            </div>
            <div>
                <label>Difficulty</label>
                <input type="range" min="1" max="10" value={difficulty} onChange={e=>setDifficulty(e.target.value)} />
            </div>
            <button onClick={save}>Save</button>
            <button onClick={remove}>Delete</button>
            <button onClick={onClose}>Cancel</button>
            {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    );
}