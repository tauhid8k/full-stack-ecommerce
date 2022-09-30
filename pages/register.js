import Link from 'next/link';
import { Layout } from '../components';
import styles from '../styles/Auth.module.css';

const RegisterScreen = () => {
  return (
    <Layout title="Register">
      <div className={styles.authContainer}>
        <form className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mt-24 mb-4">
          <h1 className="text-3xl font-medium text-center mb-3">
            Register Account
          </h1>
          <label className="block text-base font-medium mb-2">
            <span className="block mb-1">Your Name</span>
            <input className="form-input" type="text" required />
          </label>
          <label className="block text-base font-medium mb-2">
            <span className="block mb-1">Your Email</span>
            <input className="form-input" type="email" required />
          </label>
          <label className="block text-base font-medium mb-4 mt-4">
            <span className="block mb-1">Password</span>
            <input className="form-input" type="password" required />
          </label>
          <button
            type="submit"
            className="btn btn-primary w-full mt-5 mb-4 text-lg"
          >
            Register
          </button>
          <div className="text-md text-gray-500 flex items-center justify-center gap-2">
            <span>Already have an account?</span>
            <Link href="/login">
              <a className="underline hover:text-blue-500">Login here</a>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RegisterScreen;
