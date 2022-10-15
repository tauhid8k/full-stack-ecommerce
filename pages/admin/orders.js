import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import { Layout } from '../../components';
import { formatDateShort, formatDate } from '../../utils/dateFormat';
import { getError } from '../../utils/error';
import axios from 'axios';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const AdminOrdersScreen = () => {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchOrder();
  }, []);

  return (
    <Layout title="Order History">
      <div className="mt-24">
        <h1 className="text-2xl font-medium border-b pb-3 mb-4">Dashboard</h1>
        <div className="grid md:grid-cols-4 md:gap-5">
          <div>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/admin/dashboard">
                  <a className="font-medium text-purple-500 text-lg">
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin/orders">
                  <a className="font-medium text-lg">Orders</a>
                </Link>
              </li>
              <li>
                <Link href="/admin/products">
                  <a className="font-medium text-lg">Products</a>
                </Link>
              </li>
              <li>
                <Link href="/admin/users">
                  <a className="font-medium text-lg">Users</a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h1 className="text-2xl font-semibold border-b pb-4">Orders</h1>
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
                      <th className="px-4 text-left text-lg">User</th>
                      <th className="p-4 text-left text-lg">Date</th>
                      <th className="p-4 text-left text-lg">Total</th>
                      <th className="p-4 text-left text-lg">Paid</th>
                      <th className="p-4 text-left text-lg">Delivered</th>
                      <th className="p-4 text-left text-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b bg-white">
                        <td className="p-4 font-medium">
                          {order._id.substring(20, 24)}
                        </td>
                        <td className="p-4 font-medium">
                          {order.user ? (
                            order.user.name
                          ) : (
                            <span className="text-red-500 font-medium">
                              deleted user
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-medium">
                          {formatDateShort(order.createdAt)}
                        </td>
                        <td className="p-4 font-bold">${order.totalPrice}</td>
                        <td className="p-4 font-medium">
                          {order.isPaid ? (
                            <span
                              class="bg-green-100 text-green-600 p-1 px-3 rounded-full border border-green-400"
                              x-data="tooltip()"
                              x-spread="tooltip"
                              x-position="top"
                              title={formatDate(order.paidAt)}
                            >
                              Paid
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-600 p-1 px-3 rounded-full border border-red-400">
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-medium">
                          {order.isDelivered ? (
                            <span className="bg-green-100 text-green-600 p-1 px-3 rounded-full border border-green-400">
                              {formatDateShort(order.deliveredAt)}
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-600 p-1 px-3 rounded-full border border-yellow-400">
                              Not Delivered
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-medium">
                          <Link href={`/order/${order._id}`} passHref>
                            <a className="btn btn-light-primary">
                              <span>Details</span>
                            </a>
                          </Link>
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
  );
};

AdminOrdersScreen.auth = { adminOnly: true };
export default AdminOrdersScreen;
