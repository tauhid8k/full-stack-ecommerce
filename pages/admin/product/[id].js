import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReducer, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Layout } from '../../../components';
import toast, { Toaster } from 'react-hot-toast';
import { getError } from '../../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

const AdminProductEditScreen = () => {
  const router = useRouter();
  const productId = router.query.id;

  const [
    { loading, error, loadingUpdate, loadingUpload },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('category', data.category);
        setValue('brand', data.brand);
        setValue('countInStock', data.countInStock);
        setValue('description', data.description);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  const uploadHandler = async (e, imageField = 'image') => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const {
        data: { signature, timestamp },
      } = await axios('/api/admin/cloudinary-sign');

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      toast.success('File uploaded successfully');
    } catch (error) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(error) });
      toast.error(getError(error));
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated', {
        style: {
          background: '#444',
          color: '#fff',
        },
      });
      router.push('/admin/products');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(error) });
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
      <Layout title={`Edit Product ${productId}`}>
        <div className="mt-20">
          <h1 className="text-2xl font-medium border-b pb-3 mb-4">Dashboard</h1>
          <div className="grid md:grid-cols-5 md:gap-5">
            <div>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link href="/admin/dashboard">
                    <a
                      className={`font-medium text-lg ${
                        router.pathname === '/admin/dashboard'
                          ? 'text-purple-500'
                          : ''
                      }`}
                    >
                      Dashboard
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/orders">
                    <a
                      className={`font-medium text-lg ${
                        router.pathname === '/admin/orders'
                          ? 'text-purple-500'
                          : ''
                      }`}
                    >
                      Orders
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products">
                    <a
                      className={`font-medium text-lg ${
                        router.pathname === '/admin/products'
                          ? 'text-purple-500'
                          : ''
                      }`}
                    >
                      Products
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/users">
                    <a
                      className={`font-medium text-lg ${
                        router.pathname === '/admin/users'
                          ? 'text-purple-500'
                          : ''
                      }`}
                    >
                      Users
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <Link href="/admin/products">
                <a className="btn btn-light-secondary mb-3">Go Back</a>
              </Link>
              <h1 className="text-2xl font-semibold pb-4">
                Edit Product {productId}
              </h1>
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="w-full shadow-sm bg-white p-4 rounded mb-4"
              >
                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Name</span>
                  <input
                    className="form-input"
                    type="text"
                    {...register('name', {
                      required: 'Email is required',
                    })}
                  />
                </label>
                {errors.name && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.name?.message}
                  </div>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Slug</span>
                  <input
                    className="form-input"
                    type="text"
                    {...register('slug', {
                      required: 'Slug is required',
                    })}
                  />
                </label>
                {errors.slug && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.slug?.message}
                  </div>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Price</span>
                  <input
                    className="form-input"
                    type="number"
                    {...register('price', {
                      required: 'Price is required',
                    })}
                  />
                </label>
                {errors.price && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.price?.message}
                  </div>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Image</span>
                  <input
                    className="form-input"
                    type="text"
                    {...register('image', {
                      required: 'Image is required',
                    })}
                  />
                </label>
                {errors.image && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.image?.message}
                  </div>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Upload Image</span>
                  <input
                    className="form-input"
                    type="file"
                    id="imageFile"
                    onChange={uploadHandler}
                  />
                </label>
                {loadingUpload && (
                  <span className="block mb-2 text-yellow-500 font-medium">
                    Uploading...
                  </span>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Brand</span>
                  <input
                    className="form-input"
                    type="text"
                    {...register('brand', {
                      required: 'Brand is required',
                    })}
                  />
                </label>
                {errors.brand && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.brand?.message}
                  </div>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Image</span>
                  <input
                    className="form-input"
                    type="text"
                    {...register('image', {
                      required: 'Image is required',
                    })}
                  />
                </label>
                {errors.image && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.image?.message}
                  </div>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Category</span>
                  <input
                    className="form-input"
                    type="text"
                    {...register('category', {
                      required: 'Category is required',
                    })}
                  />
                </label>
                {errors.category && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.category?.message}
                  </div>
                )}

                <label className="block text-base font-medium mb-2">
                  <span className="block mb-1">Description</span>
                  <input
                    className="form-input"
                    type="text"
                    {...register('description', {
                      required: 'Description is required',
                    })}
                  />
                </label>
                {errors.description && (
                  <div className="text-red-600 text-sm font-medium">
                    {errors.description?.message}
                  </div>
                )}

                <button
                  disabled={loadingUpdate}
                  className="btn btn-primary mt-5 mb-4 text-lg"
                >
                  {loadingUpdate ? 'Loading...' : 'Update Product'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

AdminProductEditScreen.auth = { adminOnly: true };
export default AdminProductEditScreen;
