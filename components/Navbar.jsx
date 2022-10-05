import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import useCart from '../utils/useCart';
import { useState, useEffect } from 'react';
import { BsCart } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { resetCart } from '../redux/cartSlice';
import {
  HiOutlineSearch,
  HiOutlineLogout,
  HiOutlineCalendar,
  HiOutlineUserCircle,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { VscMenu } from 'react-icons/vsc';
import { Menu } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import DropdownLink from './DropdownLink';
import cookies from 'js-cookie';

const Navbar = () => {
  const { totalQty } = useCart();
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const { status, data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    setTotalItemsCount(totalQty);
  }, [totalQty]);

  const logoutClickHandler = () => {
    dispatch(
      resetCart({
        cartItems: [],
      })
    );
    cookies.remove('cart');
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="h-16 bg-white flex items-center fixed w-full z-10">
      <div className="container">
        <nav className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <VscMenu className="text-4xl p-1 cursor-pointer" />
            <Link href="/">
              <a className="text-2xl uppercase font-semibold">ECommerce</a>
            </Link>
          </div>
          <div className="hidden md:block">
            <form className="form-icon form-icon-r">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                className="form-input text-lg"
                placeholder="Search product..."
              />
            </form>
          </div>
          <div className="flex gap-5 text-2xl items-center">
            <div className="cursor-pointer md:hidden">
              <HiOutlineSearch />
            </div>
            {status === 'loading' ? (
              <div className="spinner w-4 h-4" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : session?.user ? (
              <Menu as="div" className="relative inline-block">
                <Menu.Button className="text-lg font-medium flex items-center gap-1">
                  <span>{session.user.name}</span>
                  <HiOutlineChevronDown />
                </Menu.Button>
                <Menu.Items className="absolute right-0 origin-top-right bg-white w-56 rounded-md border shadow-sm">
                  <Menu.Item>
                    <DropdownLink className="dropdown-link" href="/profile">
                      <HiOutlineUserCircle />
                      <span>Profile</span>
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <DropdownLink
                      className="dropdown-link"
                      href="/order-history"
                    >
                      <HiOutlineCalendar />
                      <span>Order History</span>
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      onClick={logoutClickHandler}
                      className="dropdown-link"
                      href="#"
                    >
                      <HiOutlineLogout />
                      <span>Logout</span>
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <Link href="/login">
                <a>
                  <FiUser />
                </a>
              </Link>
            )}
            <Link href="/cart">
              <a className={`${styles.cartLink}`}>
                <BsCart />
                <span className={styles.cartCountIcon}>{totalItemsCount}</span>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
