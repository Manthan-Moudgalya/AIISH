import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './DoctorSignUp.css';

const DoctorSignup = () => {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
  const [form, setForm] = useState({ name: '', email: '', password: '', doctorType: 'Audiologist' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.password || !form.doctorType) {
      setError('Please fill in all fields.');
      return;
    }

    if (!form.email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/doctor/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      localStorage.setItem('jwt', data.token);
      localStorage.setItem('doctor', JSON.stringify(data.doctor));
      navigate('/DoctorDashBoard');
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div id="aiish-background">
      <div id="signup-container">
        <span id="heading">Doctor SignUp</span>
        <div className="signup-form">

          {error && <div className="error-alert"><p>{error}</p></div>}

          <form id='form-tag' onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="doc-type-sel">
              <select
                name="doctorType"
                id="docType"
                value={form.doctorType}
                onChange={handleChange}
                required
              >
                <option value="Audiologist">Audiologist</option>
                <option value="SLP(Speech)">SLP(Speech)</option>
              </select>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
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

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <div className="login-link">
            <p>
              Have an Account?
              <Link to="/DoctorLogin" id="login-link"> Login</Link>
            </p>
            <div id='have-acc-login' className='text-white'> Patient?
                <Link to="/" id='sign-up'> Login </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;