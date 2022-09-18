import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { BsCart } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { HiOutlineSearch } from 'react-icons/hi';

const Navbar = () => {
  return (
    <div className="h-14 bg-white flex items-center">
      <div className="container">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl uppercase font-semibold">ECommerce</a>
          </Link>
          <div className="flex gap-5 text-2xl">
            <div className="cursor-pointer">
              <HiOutlineSearch />
            </div>
            <Link href="/login">
              <a>
                <FiUser />
              </a>
            </Link>
            <Link href="/cart">
              <a className={`${styles.cartLink}`}>
                <BsCart />
                <span className={styles.cartCountIcon}>84</span>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
