import Image from 'next/image';
import styles from './patientReg.module.css';

export default function PatientRegistration() {
  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        
        {/* Left Side - Registration Form */}
        <div className={styles.formSection}>

          <h2 className={styles.title}>JOIN US FOR A HEALTHIER TOMORROW!</h2>
          <p className={styles.subtitle}>Create your account</p>

          <input type="text" placeholder="Full Name" className={styles.input} />
          <input type="email" placeholder="Email" className={styles.input} />
          <input type="password" placeholder="Password" className={styles.input} />
          <input type="password" placeholder="Confirm Password" className={styles.input} />
          <input type="text" placeholder="Contact Number" className={styles.input} />

          <button className={styles.registerBtn}>Create Account</button>
        </div>

        {/* Right Side - Illustration */}
        <div className={styles.imageSection}>
          <Image src="/registerImage.jpg" alt="Doctor and Patient Illustration" width={320} height={330} />
        </div>
      </div>

     
    </div>
  );
}
