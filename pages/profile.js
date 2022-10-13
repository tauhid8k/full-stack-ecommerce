import axios from 'axios';
import styles from '../styles/Auth.module.css';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Layout } from '../components';
import { getError } from '../utils/error';

const ProfileScreen = () => {
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('name', session.user.name);
    setValue('email', session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      toast.success('Profile updated successfully');
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
      <Layout title="Update Profile">
        <div className={styles.authContainer}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mt-24 mb-4"
          >
            <h1 className="text-3xl font-medium text-center mb-3">
              Update Profile
            </h1>
            <label className="block text-base font-medium mb-2">
              <span className="block mb-1">Update Your Name</span>
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
              <span className="block mb-1">Update Email</span>
              <input
                className="form-input"
                type="email"
                {...register('email', {
                  required: 'Email is required!',
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
              <span className="block mb-1">Update Password</span>
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
              Update Profile
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

ProfileScreen.auth = true;
export default ProfileScreen;
