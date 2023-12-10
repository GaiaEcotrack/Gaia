import { ReadState } from 'components/TokensComponents/ReadState';
import { Burn } from 'pages/home/Burn';
import { Mint } from 'pages/home/MintButton';
import { LocalBalanceToken } from 'pages/home/MyBalanceToken';
import { VarasBalance } from 'pages/home/VarasBalance';
import {Vouchers} from 'pages/VaraComponents/Vouchers';





function Labs (){



  return (
    <div className="flex flex-col justify-center items-center">
        <h1 className='text-3xl text-black'>Mi token</h1>
        <div className="flex items-center flex-col" >
            <img className="w-96 h-96" src="/LogoGaia.svg" alt="" />
            <h2 className="text-black text-3xl">Gaia Token</h2>
            <h2 className="text-black">Saldo:</h2>
            <VarasBalance/>
            <LocalBalanceToken/>
            <Mint/>
            <Burn/>
            <ReadState/>
            <Vouchers/>
        </div>
    </div>
  );
};

export { Labs };
