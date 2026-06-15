import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';

function AppContent() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || null;
  });
  const [pendingEvent, setPendingEvent] = useState(null);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('info');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const showNotice = (text, type = 'info') => {
    setNotice(text);
    setNoticeType(type);
  };

  const clearNotice = () => {
    setNotice('');
    setNoticeType('info');
  };

  const handleEventClick = async (event) => {
    clearNotice();

    if (!currentUser) {
      setPendingEvent(event);
      navigate('/auth');
      showNotice('Please login to register for this event.', 'info');
      return;
    }

    await registerForEvent(event, currentUser);
  };

  const registerForEvent = async (event, username) => {
    try {
      const payload = {
        username,
        eventName: event.eventName,
        eventId: event.eventId,
        registeredTime: new Date().toISOString(),
      };

      const response = await fetch('/registerUserForEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result === true) {
        showNotice(`Successfully registered for ${event.eventName}.`, 'success');
      } else {
        showNotice(`Registration failed for ${event.eventName}.`, 'error');
      }
    } catch (error) {
      showNotice(`Unable to register event: ${error.message}`, 'error');
    } finally {
      navigate('/explore');
      setPendingEvent(null);
    }
  };

  const handleLoginSuccess = async (username) => {
    setCurrentUser(username);
    showNotice(`Logged in as ${username}.`, 'success');

    if (pendingEvent) {
      await registerForEvent(pendingEvent, username);
      setPendingEvent(null);
    } else {
      navigate('/explore');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/explore');
    showNotice('Logged out successfully.', 'info');
  };

  const handleBookingsClick = () => {
    clearNotice();
    if (!currentUser) {
      navigate('/auth');
      showNotice('Please login to check your booking details.', 'info');
      return;
    }
    navigate('/bookings');
  };

  return (
    <div className="app-shell">
      <header className="app-header card">
        <div className="brand-block">
          <span className="brand-title">BookMyShow</span>
        </div>

        <nav className="header-nav">
          <button type="button" className="nav-link" onClick={() => navigate('/explore')}>
            Explore Movies
          </button>
          <button type="button" className="nav-link" onClick={() => navigate('/explore')}>
            Comedy Shows
          </button>
          <button type="button" className="nav-link" onClick={() => navigate('/explore')}>
            Adventure
          </button>
        </nav>

        <div className="header-actions">
          {currentUser ? <span className="user-label">Hello, {currentUser}</span> : null}
          {!currentUser ? (
            <button type="button" className="primary-button" onClick={() => navigate('/auth')}>
              Login / Register
            </button>
          ) : (
            <button type="button" className="secondary-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      <Routes>
        <Route 
          path="/" 
          element={<HomePage currentUser={currentUser} onEventClick={handleEventClick} notice={notice} noticeType={noticeType} />}
        />
        <Route 
          path="/explore" 
          element={<HomePage currentUser={currentUser} onEventClick={handleEventClick} notice={notice} noticeType={noticeType} />}
        />
        <Route 
          path="/auth" 
          element={<AuthPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route 
          path="/bookings" 
          element={<BookingsPage username={currentUser} onBack={() => navigate('/explore')} />}
        />
      </Routes>

      <footer className="app-footer card">
        <div className="footer-inner">
          <button className="footer-link" onClick={handleBookingsClick}>My Bookings</button>
          <button
            className="footer-link"
            onClick={(e) => {
              e.preventDefault();
              showNotice('Contact support at support@example.com', 'info');
            }}
          >
            Support
          </button>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
