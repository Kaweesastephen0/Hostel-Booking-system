import React, { useState } from 'react';
import styles from './register.module.css';

function Register({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    tel: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleLoginClick = () => {
    onClose(); // Close Register modal
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
      newErrors.email = 'Invalid email address';
    if (!formData.tel.trim()) newErrors.tel = 'Phone number is required';
    else if (!/^\+?[1-9]\d{1,14}$/.test(formData.tel)) newErrors.tel = 'Invalid phone number';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Add your submission logic here (e.g., API call)
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.authContainer} onClick={(e) => e.stopPropagation()}>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <h2>Register</h2>
          <p>Enter your credentials to get on board</p>

          <div className={styles.formElements}>
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.genderOptions}>
            <label>Gender</label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              <label htmlFor="female">Female</label>
              {errors.gender && <p className={styles.error}>{errors.gender.message}</p>}
            </div>
          </div>

          <div className={styles.formElements}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.formElements}>
            <label htmlFor="tel">Tel</label>
            <input
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              type="tel"
            />
            {errors.tel && <p className={styles.error}>{errors.tel}</p>}
          </div>

          <div className={styles.formElements}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div>
            <button type="submit">Register</button>
          </div>

          <div className={styles.alternative}>
            <p>Already a member? <span onClick={handleLoginClick} style={{ cursor: 'pointer', color: 'blue' }}>Sign In</span></p>
          </div>
        </form>

        <div className={styles.authPic}>
          <img src="https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg" alt="bed image" />
        </div>
      </div>
    </div>
  );
}

export default Register;