import { useNavigate, Navigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // Protected check: If not logged in, redirect directly to /login
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Get current logged-in user from localStorage
  const currentUserJson = localStorage.getItem('currentUser') || localStorage.getItem('user');
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : { username: 'User' };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card profile-card">
        {/* Welcome Avatar Badge */}
        <div className="profile-avatar">
          {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
        </div>

        <h2 className="auth-title">Home Page</h2>
        <p className="auth-subtitle">Welcome to your dashboard!</p>

        {/* User Info Card */}
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Username:</span>
            <span className="detail-value">{currentUser.username}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value" style={{ color: '#16a34a', fontWeight: 'bold' }}>
              ● Logged In
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
