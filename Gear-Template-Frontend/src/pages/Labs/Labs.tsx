import { Mint } from 'pages/home/MintButton';
import { LocalBalanceToken } from 'pages/home/MyBalanceToken';
import React from 'react';

function Labs (){
  return (
    <div className="flex flex-col justify-center items-center">
        <h1 className='text-3xl text-black'>Mi token</h1>
        <div className="flex items-center flex-col" >
            <img className="w-96 h-96" src="/LogoGaia.svg" alt="" />
            <h2 className="text-black text-3xl">Gaia Token</h2>
            <h2 className="text-black">Saldo:</h2>
            <LocalBalanceToken/>
            <Mint/>
        </div>
    </div>
  );
};

export { Labs };
