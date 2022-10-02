import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { useState, useEffect } from 'react';
import { BsCart } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { HiOutlineSearch } from 'react-icons/hi';
import { VscMenu } from 'react-icons/vsc';
import useCart from '../utils/useCart';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { totalQty } = useCart();
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const { status, data: session } = useSession();

  useEffect(() => {
    setTotalItemsCount(totalQty);
  }, [totalQty]);

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
              <div class="spinner w-4 h-4" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            ) : session?.user ? (
              <h4 className="text-lg">{session.user.name}</h4>
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
