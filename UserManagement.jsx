import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setUser({ name: '', password: '' });
      setMessage('User added successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error adding user');
    }
  };

  const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:5000/users/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setUsers(users.filter(user => user.id !== id));
      setMessage('User deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error deleting user');
    }
  };

  const editUser = (index) => {
    setUser(users[index]);
    setIsEditing(true);
    setCurrentUserId(users[index].id);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/users/${currentUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUsers(users.map(u => (u.id === currentUserId ? updatedUser : u)));
      setUser({ name: '', password: '' });
      setIsEditing(false);
      setCurrentUserId(null);
      setMessage('User updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error updating user');
    }
  };

  return (
    <div style={styles.userManagement}>
      <h2 style={styles.header}>User Management</h2>
      {message && <p style={styles.successMessage}>{message}</p>}

      <form onSubmit={isEditing ? handleUpdateUser : handleAddUser} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="User Name"
          value={user.name}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="User Password"
          value={user.password}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {isEditing ? 'Update User' : 'Add User'}
        </button>
      </form>

      <h3 style={styles.subHeader}>Current Users</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id}>
              <td style={styles.tableCell}>{u.name}</td>
              <td style={styles.tableCell}>
                <button style={styles.actionButton} onClick={() => editUser(index)}>
                  Edit
                </button>
                <button style={styles.actionButton} onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Internal styles
const styles = {
  userManagement: {
    backgroundColor: '#fff',
    color: '#333',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#ffa600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    padding: '10px',
    width: '80%',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#ffa600',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  successMessage: {
    textAlign: 'center',
    color: '#28a745',
    fontWeight: 'bold',
  },
  subHeader: {
    textAlign: 'center',
    color: '#333',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#ffa600',
    color: '#fff',
    padding: '10px',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#ffa600',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginLeft: '5px',
  },
};

export default UserManagement;
