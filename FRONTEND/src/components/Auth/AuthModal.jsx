import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, User, CreditCard, Hash, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthModal.module.css';
import API_URL from './config/api';


// PASSWORD VALIDATION UTILITIES


/**
 * Validates password strength requirements
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid and errors array
 */
const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('At least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('One number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('One special character (!@#$%^&*...)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};


// MAIN AUTH COMPONENT
function Auth() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    gender: 'Male',
    userType: 'student',
    studentNumber: '',
    nin: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, errors: [] });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset form data helper
  const resetFormData = () => {
    setFormData({
      firstName: '',
      surname: '',
      email: '',
      gender: 'Male',
      userType: 'student',
      studentNumber: '',
      nin: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
    setPasswordValidation({ isValid: false, errors: [] });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  // Clear form when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      resetFormData();
    };
  }, []);


  // FORM VALIDATION HELPERS
  //Checks if login form is complete and valid

  const isLoginFormValid = () => {
    return formData.email.trim() !== '' && formData.password.trim() !== '';
  };

  //Checks if registration form is complete and valid
  const isRegisterFormValid = () => {
    const baseFieldsValid =
      formData.firstName.trim() !== '' &&
      formData.surname.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '';

    const userTypeFieldValid =
      formData.userType === 'student'
        ? formData.studentNumber.trim() !== ''
        : formData.nin.trim() !== '';

    return baseFieldsValid && userTypeFieldValid && passwordValidation.isValid;
  };


  // EVENT HANDLERS
  // Handles input field changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate password strength in real-time for registration
    if (name === 'password' && authMode === 'register') {
      setPasswordValidation(validatePasswordStrength(value));
    }

    setError('');
  };

  // Handles login form submission

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in the appropriate storage
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        storage.setItem('userData', JSON.stringify(data));
        storage.setItem('lastLoginTime', new Date().toISOString());

        // Reset form data
        resetFormData();

        // Notify other components about auth state change
        window.dispatchEvent(new Event('authStateChanged'));

        // Check for return URL in this order:
        // 1. returnUrl in sessionStorage (set by protected routes)
        // 2. returnUrl in URL parameters
        // 3. Default to home page
        const searchParams = new URLSearchParams(window.location.search);
        let returnUrl = sessionStorage.getItem('returnUrl') || searchParams.get('returnUrl');

        // Clean up stored return URL if it exists
        if (sessionStorage.getItem('returnUrl')) {
          sessionStorage.removeItem('returnUrl');
        }

        // Clean up URL parameters
        if (window.location.search) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Handle special case for room booking flow
        if (!returnUrl && searchParams.get('redirect') === 'booking' && searchParams.get('roomId')) {
          returnUrl = `/booking?roomId=${searchParams.get('roomId')}`;
        }

        // Navigate to the target URL or home page
        navigate(returnUrl || '/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Handles registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordCheck = validatePasswordStrength(formData.password);
    if (!passwordCheck.isValid) {
      setError(`Password must include: ${passwordCheck.errors.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          surname: formData.surname,
          email: formData.email,
          gender: formData.gender,
          userType: formData.userType,
          studentNumber: formData.userType === 'student' ? formData.studentNumber : undefined,
          nin: formData.userType === 'non-student' ? formData.nin : undefined,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form completely and switch to login
        resetFormData();
        setAuthMode('login');
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


  // MODE SWITCHING
  const switchToForgotPassword = () => {
    resetFormData();
    setAuthMode('forgot');
  };

  const switchToRegister = () => {
    resetFormData();
    setAuthMode('register');
  };

  const switchToLogin = () => {
    resetFormData();
    setAuthMode('login');
  };

  // RENDER
  return (
    <div className={styles.pageContainer}>
      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={24} />
        <span>Back to Home</span>
      </button>

      <div className={styles.contentWrapper}>
        {/* Left Side - Image with Branding */}
        <div className={styles.imageSection}>
          <div className={styles.imageBranding}>
            <h1 className={styles.brandTitle}>MUK-Book</h1>
            <p className={styles.brandTagline}>Your trusted accommodation partner</p>
          </div>
          <img
            src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Hostel accommodation"
            className={styles.heroImg}
          />
        </div>

        {/* Right Side - Form */}
        <div className={styles.formCard}>
          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <div className={`${styles.formContainer} ${styles.animatedForm}`}>
              <h2 className={styles.title}>Welcome Back</h2>
              <p className={styles.subtitle}>Login to your account</p>

              <form onSubmit={handleLogin} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>Email Address</label>
                  <div className={styles.inputGroup}>
                    <Mail className={styles.inputIcon} size={20} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.fieldWrapper}>
                  <label className={styles.fieldLabel}>Password</label>
                  <div className={styles.inputGroup}>
                    <Lock className={styles.inputIcon} size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                    {formData.password && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeIcon}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
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

                <button
                  type="submit"
                  disabled={loading || !isLoginFormValid()}
                  className={styles.submitBtn}
                >
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

          {/* REGISTRATION FORM */}
          {authMode === 'register' && (
            <div className={`${styles.formContainer} ${styles.animatedForm}`}>
              <h2 className={styles.title}>Create Account</h2>
              <p className={styles.subtitle}>Join us today</p>

              <form onSubmit={handleRegister} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.formGrid}>
                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>First Name</label>
                    <div className={styles.inputGroup}>
                      <User className={styles.inputIcon} size={20} />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>Surname</label>
                    <div className={styles.inputGroup}>
                      <User className={styles.inputIcon} size={20} />
                      <input
                        type="text"
                        name="surname"
                        placeholder="Enter your surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={`${styles.fieldWrapper} ${styles.fieldWrapperFull}`}>
                    <label className={styles.fieldLabel}>Email Address</label>
                    <div className={styles.inputGroup}>
                      <Mail className={styles.inputIcon} size={20} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>Gender</label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          onChange={handleChange}
                          className={styles.radio}
                        />
                        Male
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          onChange={handleChange}
                          className={styles.radio}
                        />
                        Female
                      </label>
                    </div>
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>User Type</label>
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
                  </div>

                  {formData.userType === 'student' && (
                    <div className={`${styles.fieldWrapper} ${styles.fieldWrapperFull}`}>
                      <label className={styles.fieldLabel}>Student Number</label>
                      <div className={styles.inputGroup}>
                        <Hash className={styles.inputIcon} size={20} />
                        <input
                          type="text"
                          name="studentNumber"
                          placeholder="Enter your student number"
                          value={formData.studentNumber}
                          onChange={handleChange}
                          required
                          className={styles.input}
                        />
                      </div>
                    </div>
                  )}

                  {formData.userType === 'non-student' && (
                    <div className={`${styles.fieldWrapper} ${styles.fieldWrapperFull}`}>
                      <label className={styles.fieldLabel}>National ID Number</label>
                      <div className={styles.inputGroup}>
                        <CreditCard className={styles.inputIcon} size={20} />
                        <input
                          type="text"
                          name="nin"
                          placeholder="Enter your national ID number"
                          value={formData.nin}
                          onChange={handleChange}
                          required
                          className={styles.input}
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>Password</label>
                    <div className={styles.inputGroup}>
                      <Lock className={styles.inputIcon} size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={styles.input}
                      />
                      {formData.password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={styles.eyeIcon}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      )}
                    </div>
                    {formData.password && !passwordValidation.isValid && (
                      <div className={styles.passwordHint}>
                        Required: {passwordValidation.errors.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className={styles.fieldWrapper}>
                    <label className={styles.fieldLabel}>Confirm Password</label>
                    <div className={styles.inputGroup}>
                      <Lock className={styles.inputIcon} size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={styles.input}
                      />
                      {formData.confirmPassword && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className={styles.eyeIcon}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      )}
                    </div>
                    {formData.confirmPassword && (
                      <div className={formData.password === formData.confirmPassword ? styles.passwordMatch : styles.passwordMismatch}>
                        {formData.password === formData.confirmPassword ? '✓ Matching' : '✗ Not matching'}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isRegisterFormValid()}
                  className={styles.submitBtn}
                >
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

          {/* FORGOT PASSWORD FORM */}
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
    </div>
  );
}


// FORGOT PASSWORD COMPONENT
function ForgotPasswordForm({ onBack, formData, handleChange, error, setError }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, errors: [] });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  //Validates if step 1 form is complete

  const isStep1Valid = () => {
    return formData.email.trim() !== '';
  };

  //Validates if step 2 form is complete
  const isStep2Valid = () => {
    return (
      resetCode.trim() !== '' &&
      newPassword.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      passwordValidation.isValid
    );
  };

  //Handles password input change with validation

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    setPasswordValidation(validatePasswordStrength(value));
  };

  //Sends password reset code to email
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
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

  // Resets password with code 
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      setError(`Password must include: ${passwordCheck.errors.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
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
        // Clear all password reset fields
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordValidation({ isValid: false, errors: [] });
        setShowNewPassword(false);
        setShowConfirmPassword(false);

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
    <div className={`${styles.formContainer} ${styles.animatedForm}`}>
      <h2 className={styles.title}>Reset Password</h2>
      <p className={styles.subtitle}>
        {step === 1 ? 'Enter your email to receive reset code' : 'Enter the code sent to your email'}
      </p>

      {/* STEP 1: Request Reset Code */}
      {step === 1 ? (
        <form onSubmit={handleSendCode} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Email Address</label>
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isStep1Valid()}
            className={styles.submitBtn}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>

          <button type="button" onClick={onBack} className={styles.backBtnSecondary}>
            Back to Login
          </button>
        </form>
      ) : (
        /* STEP 2: Reset Password with Code */
        <form onSubmit={handleResetPassword} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Reset Code</label>
            <div className={styles.inputGroup}>
              <Hash className={styles.inputIcon} size={20} />
              <input
                type="text"
                placeholder="Enter the reset code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>New Password</label>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Create a new password"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                className={styles.input}
              />
              {newPassword && (
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={styles.eyeIcon}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
            {newPassword && !passwordValidation.isValid && (
              <div className={styles.passwordHint}>
                Required: {passwordValidation.errors.join(', ')}
              </div>
            )}
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Confirm New Password</label>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.eyeIcon}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
            {confirmPassword && (
              <div className={newPassword === confirmPassword ? styles.passwordMatch : styles.passwordMismatch}>
                {newPassword === confirmPassword ? '✓ Matching' : '✗ Not matching'}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isStep2Valid()}
            className={styles.submitBtn}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button type="button" onClick={() => setStep(1)} className={styles.backBtnSecondary}>
            Back
          </button>
        </form>
      )}
    </div>
  );
}

export default Auth;