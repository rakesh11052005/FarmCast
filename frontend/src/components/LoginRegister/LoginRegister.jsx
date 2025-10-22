import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';

function LoginRegister({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setMessage('⚠️ Please fill in all required fields.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      setMessage(res.data.message);

      if (isLogin && res.data.message === 'Login successful') {
        onLoginSuccess(res.data.name); // ✅ Notify App.jsx
      }
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Something went wrong.');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? '🔑 Login' : '📝 Register'}</h2>
      <form onSubmit={handleSubmit} className="auth-card">
        {!isLogin && (
          <>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </>
        )}
        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
        <button type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'New user? Register here' : 'Already registered? Login'}
      </p>

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
}

export default LoginRegister;