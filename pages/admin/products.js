import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import { Layout } from '../../components';
import { formatDateShort } from '../../utils/dateFormat';
import { getError } from '../../utils/error';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
}

const AdminProductsScreen = () => {
  const router = useRouter();

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Product created', {
        style: {
          background: '#444',
          color: '#fff',
        },
      });
      router.push(`/admin/product/${data.product._id}`);
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(error), {
        style: {
          background: '#444',
          color: '#fff',
        },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Product deleted', {
        style: {
          background: '#444',
          color: '#fff',
        },
      });
    } catch (error) {
      dispatch({ type: 'DELETE_FAIL' });
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
      <Layout title="Admin Products">
        <div className="mt-24">
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
              <div className="flex items-center justify-between pb-4 border-b">
                <h1 className="text-2xl font-semibold">Products</h1>
                {loadingDelete && (
                  <span className="font-medium text-red-500 text-lg">
                    Deleting Item...
                  </span>
                )}
                <button
                  className="btn btn-light-warning"
                  disabled={loadingCreate}
                  onClick={createHandler}
                >
                  {loadingCreate ? 'Loading...' : 'Add New'}
                </button>
              </div>
              {loading ? (
                <div className="mt-5 text-center">
                  <div className="spinner text-primary w-12 h-12" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="mt-5 text-center">
                  <h4 className="text-red-500 text-2xl font-medium">{error}</h4>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="border-b-2 bg-white">
                      <tr>
                        <th className="px-4 text-left text-lg">ID</th>
                        <th className="px-4 text-left text-lg">Name</th>
                        <th className="p-4 text-left text-lg">Price</th>
                        <th className="p-4 text-left text-lg">Category</th>
                        <th className="p-4 text-left text-lg">In Stock</th>
                        <th className="p-4 text-left text-lg">Rating</th>
                        <th className="p-4 text-left text-lg">Added</th>
                        <th className="p-4 text-left text-lg">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-b bg-white">
                          <td className="p-4 font-medium">
                            {product._id.substring(20, 24)}
                          </td>
                          <td className="p-4 font-bold">{product.name}</td>
                          <td className="p-4 font-bold">${product.price}</td>
                          <td className="p-4 font-bold">{product.category}</td>
                          <td className="p-4 font-bold">
                            {product.countInStock > 0 ? (
                              product.countInStock
                            ) : (
                              <span className="text-red-500">0</span>
                            )}
                          </td>
                          <td className="p-4 font-bold">{product.rating}</td>
                          <td className="p-4 font-medium">
                            {formatDateShort(product.createdAt)}
                          </td>
                          <td className="p-4 font-medium flex gap-2 items-center">
                            <Link
                              href={`/admin/product/${product._id}`}
                              passHref
                            >
                              <a className="btn btn-light-primary">
                                <span>Edit</span>
                              </a>
                            </Link>
                            <button
                              onClick={() => deleteHandler(product._id)}
                              className="btn btn-light-danger"
                            >
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

AdminProductsScreen.auth = { adminOnly: true };
export default AdminProductsScreen;
