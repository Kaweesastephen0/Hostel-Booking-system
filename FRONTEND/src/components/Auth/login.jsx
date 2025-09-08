<<<<<<< Updated upstream
import React from 'react';
import styles from './Auth.module.css';

function Login({ onClose, isRegisterMode }) {
  const handleRegisterClick = () => {
    onClose(); // Close current modal
    // You can trigger register modal or navigate manually here
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.authContainer} onClick={(e) => e.stopPropagation()}>
        <form className={styles.authForm}>
          <h2>Login</h2>
          <p>Enter your credentials to get on board</p>

          <div className={styles.formElements}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />
          </div>

          <div className={styles.formElements}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
          </div>

          <div className={styles.rememberMe}>
            <input type="checkbox" id="checkbox" />
            <label htmlFor="rememberMe">remember me</label>
          </div>

          <div>
            <button type="submit">Login</button>
          </div>

          <div className={styles.alternative}>
            <p>Not a member? <span onClick={handleRegisterClick} style={{ cursor: 'pointer', color: 'blue' }}>Create an account</span></p>
          </div>
        </form>

        <div className={styles.authPic}>
          <img src="https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg" alt="bed image" />
        </div>
      </div>
    </div>
  );
}

export default Login;
=======
import React from 'react'
import styles from './Auth.module.css'
function Login() {
  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm}>
        <h2>Login</h2>
        <p>Enter your credentials to get on board</p>

        <div className={styles.formElements}>
             <label htmlFor="email">Email</label>
             <input type="email" id='email' />
        </div>

         <div className={styles.formElements}>
            <label htmlFor="password">Password</label>
            <input type="password" id='password' />
        </div>

        <div className={styles.rememberMe}>
          <input type="checkbox" id='checkbox' />
          <label htmlFor="rememberMe">remember me</label>
        </div>   

        <div>
            <button>
                Login
            </button>
        </div>

        <div className="alternative">
        <p>Not a member? Create an account</p>
        </div>

      </form>

      <div className={styles.authPic}>
        <img src="https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg" alt="bed image" />
      </div>
    </div>
  )
}

export default Login
>>>>>>> Stashed changes
