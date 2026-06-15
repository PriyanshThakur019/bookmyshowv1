import { useState } from 'react';

const initialLogin = {
  username: '',
  password: '',
};

const initialRegister = {
  username: '',
  name: '',
  password: '',
  email: '',
  phoneNumber: '',
};

function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [loginData, setLoginData] = useState(initialLogin);
  const [registerData, setRegisterData] = useState(initialRegister);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessages = () => {
    setMessage('');
    setMessageType('');
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        showMessage(`Login request failed: ${response.status} ${response.statusText}`, 'error');
        return;
      }

      const result = await response.json();
      if (result === true) {
        showMessage('Login successful. Welcome to the BookMyShow clone.', 'success');
        if (onLoginSuccess) {
          onLoginSuccess(loginData.username);
        }
      } else {
        showMessage('Invalid username or password.', 'error');
      }
    } catch (error) {
      showMessage(`Unable to reach backend: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (response.status === 226) {
        showMessage('Username already exists. Please choose another username.', 'error');
      } else if (response.status === 403) {
        showMessage('Phone number already exists. Please use a different phone number.', 'error');
      } else if (response.ok && result === true) {
        showMessage('Registration successful. You can now log in.', 'success');
        setMode('login');
        setRegisterData(initialRegister);
      } else {
        showMessage('Registration failed. Please check your details and try again.', 'error');
      }
    } catch (error) {
      showMessage(`Unable to reach backend: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card card">
      <div className="card-header">
        <h2>{mode === 'login' ? 'Member Login' : 'Create Account'}</h2>
        <div className="toggle-buttons">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login');
              clearMessages();
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register');
              clearMessages();
            }}
          >
            Register
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {mode === 'login' ? (
        <form className="form" onSubmit={handleLoginSubmit}>
          <label>
            Username
            <input
              name="username"
              type="text"
              value={loginData.username}
              onChange={handleLoginChange}
              required
              placeholder="abcd"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              placeholder="xyz"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form className="form" onSubmit={handleRegisterSubmit}>
          <label>
            Username
            <input
              name="username"
              type="text"
              value={registerData.username}
              onChange={handleRegisterChange}
              required
              placeholder="abcd"
            />
          </label>
          <label>
            Full Name
            <input
              name="name"
              type="text"
              value={registerData.name}
              onChange={handleRegisterChange}
              required
              placeholder="John Doe"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
              placeholder="xyz"
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Phone Number
            <input
              name="phoneNumber"
              type="tel"
              value={registerData.phoneNumber}
              onChange={handleRegisterChange}
              required
              placeholder="9876543210"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
}

export default AuthPage;
