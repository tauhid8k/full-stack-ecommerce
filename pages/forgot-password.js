import Link from 'next/link';
import { Layout } from '../components';
import styles from '../styles/Auth.module.css';

const ForgotPasswordScreen = () => {
  return (
    <Layout title="Email verify">
      <div className={styles.authContainer}>
        <form className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mt-24">
          <h1 className="text-3xl font-medium text-center mb-3">Email</h1>
          <label className="block text-base font-medium mb-2">
            <span className="block mb-1">Your Email</span>
            <input className="form-input" type="email" required />
          </label>
          <div className="flex items-end gap-4">
            <button type="submit" className="btn btn-primary mt-5">
              Send Verification Code
            </button>
            <Link href="/login">
              <a className="btn btn-light-secondary">Go Back</a>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPasswordScreen;
