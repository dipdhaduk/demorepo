import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  // 2 fields: username and password
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle register submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const { username, password } = formData;

    // Validation: both fields required
    if (!username.trim() || !password) {
      setErrorMessage('Both username and password are required.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    // Save registered user into localStorage
    const newUser = {
      username: username.trim(),
      password: password,
    };

    localStorage.setItem('user', JSON.stringify(newUser));

    // Redirect to login page
    navigate('/login', {
      state: { successMessage: 'Registration successful! Please log in.' },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Create an account with username & password</p>

        {/* Error alert */}
        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
