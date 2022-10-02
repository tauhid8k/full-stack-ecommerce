import Link from 'next/link';
import styles from '../styles/Auth.module.css';
import { useEffect } from 'react';
import { Layout } from '../components';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { getError } from '../utils/error';
import { useRouter } from 'next/router';

const LoginScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, redirect, session]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error, {
          style: {
            background: '#444',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <>
      <Toaster />
      <Layout title="Login">
        <div className={styles.authContainer}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mt-24 mb-4"
          >
            <h1 className="text-3xl font-medium text-center mb-3">Login</h1>
            <label className="block text-base font-medium mb-2">
              <span className="block mb-1">Your Email</span>
              <input
                className="form-input"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: 'Email is invalid',
                  },
                })}
              />
            </label>
            {errors.email && (
              <div className="text-red-600 text-sm font-medium">
                {errors.email?.message}
              </div>
            )}
            <label
              className={`block text-base font-medium ${
                errors.password ? 'mb-2' : 'mb-4'
              } mt-4`}
            >
              <span className="block mb-1">Your Password</span>
              <input
                className="form-input"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Minimum 8 characters required',
                  },
                })}
              />
            </label>
            {errors.password && (
              <div className="text-red-600 text-sm font-medium mb-4">
                {errors.password?.message}
              </div>
            )}
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
    </>
  );
};

export default LoginScreen;
