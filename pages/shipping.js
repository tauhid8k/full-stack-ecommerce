import { useForm } from 'react-hook-form';
import { CheckoutWizard, Layout } from '../components';
import { saveShippingAddress } from '../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import cookies from 'js-cookie';
import { useRouter } from 'next/router';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('fullName', shippingAddress?.fullName);
    setValue('address', shippingAddress?.address);
    setValue('city', shippingAddress?.city);
    setValue('postal', shippingAddress?.postal);
    setValue('mobile', shippingAddress?.mobile);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postal, mobile }) => {
    dispatch(saveShippingAddress({ fullName, address, city, postal, mobile }));
    cookies.set(
      'cart',
      JSON.stringify({
        cartItems,
        shippingAddress: { fullName, address, city, postal, mobile },
      })
    );
    router.push('/payment');
  };

  return (
    <Layout title="Shipping Address">
      <div className="mt-24 mb-8">
        <CheckoutWizard activeStep={1} />
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mb-4"
      >
        <h1 className="text-3xl font-medium text-center mb-3">
          Shipping Address
        </h1>
        <label className="block text-base font-medium mb-4">
          <span className="block mb-1 text-lg">
            Full Name<strong className="text-2xl text-red-500">*</strong>
          </span>
          <input
            className="form-input"
            type="text"
            {...register('fullName', {
              required: 'Full Name is required',
            })}
          />
        </label>
        {errors.fullName && (
          <div className="text-red-600 font-medium mb-3 -mt-3">
            {errors.fullName?.message}
          </div>
        )}
        <label className="block text-base font-medium mb-4">
          <span className="block mb-1 text-lg">
            Street Address<strong className="text-2xl text-red-500">*</strong>
            &nbsp; (Area, House, Road, Section)
          </span>
          <input
            className="form-input"
            type="text"
            {...register('address', {
              required: 'Street Address is required',
              minLength: { value: 4, message: 'Address is too short!' },
            })}
          />
        </label>
        {errors.address && (
          <div className="text-red-600 font-medium mb-3 -mt-3">
            {errors.address?.message}
          </div>
        )}
        <div className="block text-base font-medium mb-4">
          <span className="block mb-1 text-lg">
            Select City<strong className="text-2xl text-red-500">*</strong>
          </span>
          <select
            className="form-select text-lg text-gray-600"
            {...register('city', {
              required: 'City Name is required',
            })}
          >
            <option value="Bagerhat">Bagerhat</option>
            <option value="Bandarban">Bandarban</option>
            <option value="Barguna">Barguna</option>
            <option value="Barisal">Barisal</option>
            <option value="Bhola">Bhola</option>
            <option value="Bogra">Bogra</option>
            <option value="Brahmanbaria">Brahmanbaria</option>
            <option value="Chandpur">Chandpur</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Chuadanga">Chuadanga</option>
            <option value="Comilla">Comilla</option>
            <option value="Cox'sBazar">Cox&#39;sBazar</option>
            <option value="Dhaka" defaultValue="Dhaka">
              Dhaka
            </option>
            <option value="Dinajpur">Dinajpur</option>
            <option value="Faridpur">Faridpur</option>
            <option value="Feni">Feni</option>
            <option value="Gaibandha">Gaibandha</option>
            <option value="Gazipur">Gazipur</option>
            <option value="Gopalganj">Gopalganj</option>
            <option value="Habiganj">Habiganj</option>
            <option value="Jaipurhat">Jaipurhat</option>
            <option value="Jamalpur">Jamalpur</option>
            <option value="Jessore">Jessore</option>
            <option value="Jhalokati">Jhalokati</option>
            <option value="Jhenaidah">Jhenaidah</option>
            <option value="Khagrachari">Khagrachari</option>
            <option value="Khulna">Khulna</option>
            <option value="Kishoreganj">Kishoreganj</option>
            <option value="Kurigram">Kurigram</option>
            <option value="Kushtia">Kushtia</option>
            <option value="Lakshmipur">Lakshmipur</option>
            <option value="Lalmonirhat">Lalmonirhat</option>
            <option value="Madaripur">Madaripur</option>
            <option value="Magura">Magura</option>
            <option value="Manikganj">Manikganj</option>
            <option value="Maulvibazar">Maulvibazar</option>
            <option value="Meherpur">Meherpur</option>
            <option value="Munshiganj">Munshiganj</option>
            <option value="Mymensingh">Mymensingh</option>
            <option value="Naogaon">Naogaon</option>
            <option value="Narail">Narail</option>
            <option value="Narayanganj">Narayanganj</option>
            <option value="Narsingdi">Narsingdi</option>
            <option value="Natore">Natore</option>
            <option value="Nawabganj">Nawabganj</option>
            <option value="Netrokona">Netrokona</option>
            <option value="Nilphamari">Nilphamari</option>
            <option value="Noakhali">Noakhali</option>
            <option value="Pabna">Pabna</option>
            <option value="Panchagarh">Panchagarh</option>
            <option value="Patuakhali">Patuakhali</option>
            <option value="Pirojpur">Pirojpur</option>
            <option value="Rajbari">Rajbari</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Rangamati">Rangamati</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Satkhira">Satkhira</option>
            <option value="Shariatpur">Shariatpur</option>
            <option value="Sherpur">Sherpur</option>
            <option value="Sirajganj">Sirajganj</option>
            <option value="Sunamganj">Sunamganj</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Tangail">Tangail</option>
            <option value="Thakurgaon">Thakurgaon</option>
          </select>
        </div>
        {errors.city && (
          <div className="text-red-600 font-medium mb-3 -mt-3">
            {errors.city?.message}
          </div>
        )}
        <label className="block text-base font-medium mb-4">
          <span className="block mb-1 text-lg">
            Postal Code<strong className="text-2xl text-red-500">*</strong>
          </span>
          <input
            className="form-input"
            type="text"
            {...register('postal', {
              required: 'Postal Code is required',
            })}
          />
        </label>
        {errors.postal && (
          <div className="text-red-600 font-medium mb-3 -mt-3">
            {errors.postal?.message}
          </div>
        )}
        <label className="block text-base font-medium mb-4">
          <span className="block mb-1 text-lg">
            Mobile Number<strong className="text-2xl text-red-500">*</strong>
          </span>
          <input
            className="form-input"
            type="tel"
            {...register('mobile', {
              required: 'Mobile Number is required',
              minLength: { value: 11, message: 'Minimum 11 digits required' },
            })}
          />
        </label>
        {errors.mobile && (
          <div className="text-red-600 font-medium -mt-3">
            {errors.mobile?.message}
          </div>
        )}
        <div className="text-right">
          <button type="submit" className="btn btn-primary mt-5 mb-4 text-lg">
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
};

ShippingScreen.auth = true;
export default ShippingScreen;
