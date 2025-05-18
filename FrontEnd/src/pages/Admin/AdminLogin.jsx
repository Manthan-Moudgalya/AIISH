import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('jwt', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      navigate('/AdminDashBoard');
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div id="aiish-background">
      <div id="login-container">
      <span className='heading'>Admin Login</span>
        <div className="login-form">
          <h2>Doctor Login</h2>
          
          {error && (
            <div className="error-alert">
              <p>{error}</p>
            </div>
          )}
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className='btn-container'>
            <button className="login-button" onClick={handleLogin}>
              Log In
            </button>
          </div> 
          <div id='have-acc-login' className='text-white'> Patient?
              <Link to="/" id='sign-up'>  Login </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


