import React, { useState } from 'react';
import { registerUser } from '../features/auth/authService';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [transition, setTransition] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const isRegister = async () => {
    try {
      const user = await registerUser(email, password, firstname, lastname);
      if (!user) {
        setError("Registration failed! Please try again.");
        setSuccess(null);
      } else {
        console.log("Registered:", user);
        setError(null);
        setSuccess("Account created successfully!");
        setTimeout(() => {
          setTransition(true);
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className={`registerSection ${transition ? 'animation' : ''}`}>
      <button className="backButton" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="registerTitle">Register</h2>
      <form onSubmit={(e) => { e.preventDefault(); isRegister(); }} className="registerForm">
        <input type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)} className="registerInput"/>
        <input type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)} className="registerInput"/>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="registerInput"/>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="registerInput"/>
        <button type="submit" id="registerButton">Register</button>
      </form>
      {error && <p className="errorRegister">{error}</p>}
      {success && <p className="successRegister">{success}</p>}
    </div>
  );
}