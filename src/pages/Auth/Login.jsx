import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password); // Create a new user
            console.log(userCredential); // Log the user object
            const user = userCredential.user;  // Get the user object from the userCredential
            localStorage.setItem('token', user.accessToken); // Save the token to local storage
            localStorage.setItem('user', JSON.stringify(user)); // Save the user object to local storage
            navigate('/'); // Navigate to the home page after successful registration
        } catch (error) {
            console.log(error);
        }

    }

return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className='login-form'>
            <div>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit" className='login'>Login</button>
        </form>
        <p>Need to Register? <Link to="/register">Register</Link></p>
    </div>
    )}

export default Login