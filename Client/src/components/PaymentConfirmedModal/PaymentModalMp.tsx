import React from 'react';

const PaymentModalMp = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <h1 className='fixed text-7xl'>Your payment was confirmed, thank you for your purchase :)</h1>
      <img
        className='w-full h-full'
        src="/payment.jpg"
        alt="Payment"
      />
    </div>
  );
};

export default PaymentModalMp;
