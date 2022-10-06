const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <div className="flex flex-wrap">
      {['User Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step, index) => (
          <div
            className={`flex-1 border-b-2 p-1 font-medium text-center ${
              index <= activeStep
                ? 'border-purple-600 text-purple-600'
                : 'text-gray-500 border-gray-500'
            }`}
            key={step}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
};

export default CheckoutWizard;
