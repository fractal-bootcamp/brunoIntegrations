import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3010/users')
            .then(response => response.json())
            .then(data => setUsers(data));
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user: { id: number; name: string; email: string }) => (
                    <li key={user.id}>{user.name} ({user.email})</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
