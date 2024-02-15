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
    <div>
      <a 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        href="https://commerce.coinbase.com/checkout/5745368b-a198-4a09-87a9-3e1e38ff2fce"
      >
        Buy with Crypto
      </a>
    </div>
  );
};

export default CoinbaseButton;
