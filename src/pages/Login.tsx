// src/pages/Login.tsx
import React, { useState } from 'react';
import { loginUser } from '../features/auth/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // when there is an error it update as string
  const [_shake, setShake] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // it will goes to another page!

  const isLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await loginUser(email, password);
    if (!user) {
        setError("Invalid email or password")
        setShake(true);
        setTimeout(() => setShake(false), 500);
    } else {
        console.log("Logged in:", user);
        setError(null);
        dispatch(setUser(user));
        navigate('/dashboard');
    }
  };

  return (
    <div className="body">
      <div className={`loginSection ${error ? "shake" :   ""}`}>
          <h2 className='loginTitle'>Login</h2>
          <form onSubmit={isLogin} className='loginForm'>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="loginInput"required/>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="loginInput"required/>
              <button type="submit" className="loginButton" >Login</button>
          </form>
          {error && <p className="loginError">{error}</p>}
          <p className="registerPrompt">Don't have an account yet?</p>
          <button className="registerButton" onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}