import { useEffect, useState } from "react";
import { getSessions, deleteSession } from "../api/api"

export default function SessionList() {
    const [sessions, setSessions] = useState([]);

    const load = async () => {
        const res = await getSessions();
        setSessions(res.data.data);
    };

    const remove = async (id) => {
        if (!window.confirm("Delete this session?")) return;
        await deleteSession(id);
        load();
    };

    useEffect(() => {
        load();
    }, []);


    return (
        <div style={styles.wrapper}>
            <h2>Your Study Sessions</h2>

            {sessions.length === 0 ? (
                <p>No sessions yet...</p>
            ) : (
                <ul style={styles.list}>
                    {sessions.map((s) => (
                        <li key={s._id} style={styles.item}>
                            <div>
                                <strong>{s.courseId}</strong><br />
                                {new Date(s.startsTime).loLocalString()} →{" "}
                                {new Date(s.endtTime).toLocaleString()}<br />
                                Difficulty: {s.difficulty}
                            </div>

                            <button onClick={() => remove(s._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    wrapper: { padding: 20 },
    list: { listStyle: "none", padding: 0},
    item: {
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: 8,
        marginBottom: 10,
        display: "flex",
        justifyContent: "space-between"
    }
};