import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Registration success flash message
  const registrationSuccessMessage = location.state?.successMessage || '';

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

  // Handle login submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const { username, password } = formData;

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    // Retrieve registered user from localStorage
    const savedUserJson = localStorage.getItem('user');

    if (!savedUserJson) {
      setErrorMessage('No registered user found. Please register first.');
      return;
    }

    const savedUser = JSON.parse(savedUserJson);

    // Verify username and password
    const isUsernameMatch =
      savedUser.username &&
      savedUser.username.toLowerCase() === username.trim().toLowerCase();
    const isPasswordMatch = savedUser.password === password;

    if (isUsernameMatch && isPasswordMatch) {
      // Save login flag & current user
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          username: savedUser.username,
        })
      );

      // Redirect to Home page after successful login
      navigate('/home');
    } else {
      setErrorMessage('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to your account</p>

        {/* Success message from register */}
        {registrationSuccessMessage && (
          <div className="alert alert-success">{registrationSuccessMessage}</div>
        )}

        {/* Error alert */}
        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
