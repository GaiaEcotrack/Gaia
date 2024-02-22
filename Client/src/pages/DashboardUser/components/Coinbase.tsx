import React, { useEffect } from 'react';

const CoinbaseButton = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://commerce.coinbase.com/v1/checkout.js?version=201807';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='w-40 h-16 flex items-center justify-center gap-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded '>
              <img src="/coinbase.svg" className='w-10' alt="" />
      <a 
        href="https://commerce.coinbase.com/checkout/5745368b-a198-4a09-87a9-3e1e38ff2fce"
      >
        Buy with Crypto
      </a>
    </div>
  );
};

export default CoinbaseButton;
