import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';

function LoginRegister({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setMessage('⚠️ Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      setMessage(res.data.message);

      if (isLogin && res.data.message === 'Login successful') {
        onLoginSuccess(res.data); // ✅ Pass full profile object
      }

      setLoading(false);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Something went wrong.');
      setLoading(false);
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
              required
            />
          </>
        )}
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Processing...' : isLogin ? 'Login' : 'Register'}
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