import React from 'react';
import { VarasBalance } from '../../pages/home/VarasBalance';
import { LocalBalanceToken } from '../../pages/home/MyBalanceToken';
import { Mint } from '../../pages/home/MintButton';
import { Burn } from '../../pages/home/Burn';
import { ReadState } from '../../components/TokensComponents/ReadState';
import axios from 'axios';

function Labs () {
    const fetch = async ()=>{
        try {
           const request = await axios.post('http://127.0.0.1:5000/chatbox/',{"message":"hello"})
           const data = request.data
           console.log(data);
           

        } catch (error) {
            console.log(error);
            
        }
    }
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
                <button onClick={fetch}>data</button>
            </div>
        </div>
    );
}

export { Labs };