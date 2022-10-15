import axios from 'axios';
import Link from 'next/link';
import { useReducer, useEffect } from 'react';
import { Layout } from '../../components';
import { getError } from '../../utils/error';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const option = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const AdminDashboardScreen = () => {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: false,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  console.log(summary);

  const data = {
    labels: summary.salesData.map((x) => x._id),
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="mt-20">
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
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-3">
                  <div className="bg-white p-3 rounded shadow-sm border border-green-500">
                    <p className="font-semibold text-4xl mb-1 text-green-500">
                      ${summary.ordersPrice}
                    </p>
                    <p className="font-medium text-2xl mb-2">Sales</p>
                    <Link href="/admin/orders">
                      <a className="text-base font-medium text-purple-500">
                        View sales
                      </a>
                    </Link>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm border border-red-500">
                    <p className="font-semibold text-4xl mb-1 text-red-500">
                      {summary.ordersCount}
                    </p>
                    <p className="font-medium text-2xl mb-2">Orders</p>
                    <Link href="/admin/orders">
                      <a className="text-base font-medium text-purple-500">
                        View orders
                      </a>
                    </Link>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm border border-blue-500">
                    <p className="font-semibold text-4xl mb-1 text-blue-500">
                      {summary.productsCount}
                    </p>
                    <p className="font-medium text-2xl mb-2">Products</p>
                    <Link href="/admin/orders">
                      <a className="text-base font-medium text-purple-500">
                        View products
                      </a>
                    </Link>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm border border-yellow-500">
                    <p className="font-bold text-4xl mb-1 text-yellow-500">
                      {summary.usersCount}
                    </p>
                    <p className="font-medium text-2xl mb-2">Users</p>
                    <Link href="/admin/orders">
                      <a className="text-base font-medium text-purple-500">
                        View users
                      </a>
                    </Link>
                  </div>
                </div>
                <h1 className="text-3xl mt-8">Sales Report</h1>
                <Bar
                  options={{ legend: { display: true, position: 'right' } }}
                  data={data}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
