import React from 'react';
import { VarasBalance } from '../../pages/home/VarasBalance';
import { LocalBalanceToken } from '../../pages/home/MyBalanceToken';
import { Mint } from '../../pages/home/MintButton';
import { Burn } from '../../pages/home/Burn';
import { ReadState } from '../../components/TokensComponents/ReadState';
import PaypalButton from './PaypalButton';

function Labs () {
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className='text-3xl text-white'>LABS</h1>
            <div className="flex items-center flex-col" >
                <img className="w-96 h-96" src="/LogoGaia.svg" alt="" />
                <h2 className="text-white text-3xl">Gaia Token</h2>
                <h2 className="text-black">Saldo:</h2>
                <VarasBalance/>
                <LocalBalanceToken/>
                <Mint/>
                <Burn/>
                <ReadState/>
                <PaypalButton totalValue="60.00" invoice="Subscripcion" />
            </div>
        </div>
    );
}

export { Labs };