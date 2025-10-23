
import { useState } from 'react';
import { X, Mail, Lock, User, CreditCard, Hash } from 'lucide-react';
import styles from './AuthModal.module.css';

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    userType: 'student',
    studentNumber: '',
    nin: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (formData.rememberMe) {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data));
        } else {
          sessionStorage.setItem('userToken', data.token);
          sessionStorage.setItem('userData', JSON.stringify(data));
        }
        onLoginSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          surname: formData.surname,
          email: formData.email,
          userType: formData.userType,
          studentNumber: formData.userType === 'student' ? formData.studentNumber : undefined,
          nin: formData.userType === 'non-student' ? formData.nin : undefined,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAuthMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setError('');
        alert('Registration successful! Please check your email and then login.');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchToForgotPassword = () => {
    setAuthMode('forgot');
    setError('');
  };

  const switchToRegister = () => {
    setAuthMode('register');
    setError('');
  };

  const switchToLogin = () => {
    setAuthMode('login');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        {authMode === 'login' && (
          <div className={styles.formContainer}>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Login to your account</p>

            <form onSubmit={handleLogin} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.inputGroup}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.rememberRow}>
                <label className={styles.rememberLabel}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className={styles.forgotLink}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className={styles.switchText}>
                Don't have an account?{' '}
                <button type="button" onClick={switchToRegister} className={styles.switchLink}>
                  Register here
                </button>
              </p>
            </form>
          </div>
        )}

        {authMode === 'register' && (
          <div className={styles.formContainer}>
            <h2 className={styles.title}>Create Account</h2>
            <p className={styles.subtitle}>Join us today</p>

            <form onSubmit={handleRegister} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.inputGroup}>
                <User className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <User className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={formData.userType === 'student'}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  Student
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    value="non-student"
                    checked={formData.userType === 'non-student'}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  Non-Student
                </label>
              </div>

              {formData.userType === 'student' && (
                <div className={styles.inputGroup}>
                  <Hash className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    name="studentNumber"
                    placeholder="Student Number"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
              )}

              {formData.userType === 'non-student' && (
                <div className={styles.inputGroup}>
                  <CreditCard className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    name="nin"
                    placeholder="National ID Number"
                    value={formData.nin}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>

              <p className={styles.switchText}>
                Already have an account?{' '}
                <button type="button" onClick={switchToLogin} className={styles.switchLink}>
                  Login here
                </button>
              </p>
            </form>
          </div>
        )}

        {authMode === 'forgot' && (
          <ForgotPasswordForm
            onBack={switchToLogin}
            formData={formData}
            handleChange={handleChange}
            error={error}
            setError={setError}
          />
        )}
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack, formData, handleChange, error, setError }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        alert('Reset code sent to your email!');
      } else {
        setError(data.message || 'Failed to send reset code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          resetCode: resetCode,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successful! Please login.');
        onBack();
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Reset Password</h2>
      <p className={styles.subtitle}>
        {step === 1 ? 'Enter your email to receive reset code' : 'Enter the code sent to your email'}
      </p>

      {step === 1 ? (
        <form onSubmit={handleSendCode} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>

          <button type="button" onClick={onBack} className={styles.backBtn}>
            Back to Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <Hash className={styles.inputIcon} size={20} />
            <input
              type="text"
              placeholder="Reset Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>
            Back
          </button>
        </form>
      )}
    </div>
  );
}

export default AuthModal;
