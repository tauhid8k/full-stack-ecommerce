import Link from 'next/link';
import { Layout } from '../components';
import styles from '../styles/Auth.module.css';

const LoginScreen = () => {
  return (
    <Layout title="Login">
      <div className={styles.authContainer}>
        <form className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mt-24 mb-4">
          <h1 className="text-3xl font-medium text-center mb-3">Login</h1>
          <label className="block text-base font-medium mb-2">
            <span className="block mb-1">Your Email</span>
            <input className="form-input" type="email" required />
          </label>
          <label className="block text-base font-medium mb-4 mt-4">
            <span className="block mb-1">Your Password</span>
            <input className="form-input" type="password" required />
          </label>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                name="remember"
                type="checkbox"
                className="form-checkbox"
              />
              <span className="block ml-2 text-base font-medium text-gray-500 cursor-pointer">
                Remember me
              </span>
            </label>
            <Link href="/forgot-password">
              <a className="text-base font-medium text-gray-500">
                Forgot password?
              </a>
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full mt-5 mb-4 text-lg"
          >
            Login
          </button>
          <div className="text-md text-gray-500 flex items-center justify-center gap-2">
            <span>No account?</span>
            <Link href="/register">
              <a className="underline hover:text-blue-500">Register here</a>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default LoginScreen;
