import Image from 'next/image';
import styles from './login.module.css';
import Link from 'next/link';



export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        
        {/* Left: Form Section */}
        <div className={styles.formSection}>
          <h2 className={styles.title}>WELCOME BACK!</h2>
          <p className={styles.subtitle}>YOUR HEALTH JOURNEY AWAITS!</p>
          
          <input type="text" placeholder="Email / Username" className={styles.input} />
          <input type="password" placeholder="Password" className={styles.input} />
          
          <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
          <button className={styles.loginBtn}>Login</button>

          {/* Not Registered Yet? + Create Account Button */}
          <p className={styles.notRegistered}>Not registered yet?</p>
          <Link href="./PatientRegistration">
            <button className={styles.createAccountBtn}>Create an Account</button>
          </Link>
           </div>

        {/* Right: Image Section */}
        <div className={styles.imageSection}>
          <Image src="/loginimage.jpg" alt="Login Illustration" width={350} height={300} />
        </div>

      </div>
    </div>
  );
}
