import Link from 'next/link';
import styles from '../styles/Auth.module.css';
import { useEffect } from 'react';
import { Layout } from '../components';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getError } from '../utils/error';

const RegisterScreen = () => {
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

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

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
      toast.error(getError(error), {
        style: {
          background: '#444',
          color: '#fff',
        },
      });
    }
  };

  return (
    <>
      <Toaster />
      <Layout title="Create Account">
        <div className={styles.authContainer}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mt-24 mb-4"
          >
            <h1 className="text-3xl font-medium text-center mb-3">
              Create Account
            </h1>
            <label className="block text-base font-medium mb-2">
              <span className="block mb-1">Your Name</span>
              <input
                className="form-input"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                })}
                autoFocus
              />
            </label>
            {errors.name && (
              <div className="text-red-600 text-sm font-medium">
                {errors.name?.message}
              </div>
            )}
            <label
              className={`block text-base font-medium ${
                errors.email ? 'mb-2' : 'mb-4'
              } mt-4`}
            >
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
              <span className="block mb-1">Set Password</span>
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
              <div className="text-red-600 text-sm font-medium">
                {errors.password?.message}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full mt-4 mb-4 text-lg"
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
    </>
  );
};

export default RegisterScreen;
