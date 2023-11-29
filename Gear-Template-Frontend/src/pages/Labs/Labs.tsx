import React from 'react';
import { GearApi } from '@gear-js/api';
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { ReadState } from 'components/TokensComponents/ReadState';
import { TotalSupply } from 'components/TokensComponents/TotalSupply';
import { Burn } from 'pages/home/Burn';
import { Mint } from 'pages/home/MintButton';
import { LocalBalanceToken } from 'pages/home/MyBalanceToken';
import { Transfer } from 'pages/home/Transfer';



async function connect() {
  const gearApi = await GearApi.create({
    providerAddress: 'wss://testnet.vara-network.io',
  });

  const [chain, nodeName, nodeVersion] = await Promise.all([
    gearApi.chain(),
    gearApi.nodeName(),
    gearApi.nodeVersion(),
  ]);

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`,
  );

  const unsub = await gearApi.gearEvents.subscribeToNewBlocks((header) => {
    console.log(
      `New block with number: ${header.number.toNumber()} and hash: ${header.hash.toHex()}`,
    );
  });
}


function Labs (){



  const {account} = useAccount();

console.log(account)

  return (
    <div className="flex flex-col justify-center items-center">
        <h1 className='text-3xl text-black'>Mi token</h1>
        <div className="flex items-center flex-col" >
            <img className="w-96 h-96" src="/LogoGaia.svg" alt="" />
            <h2 className="text-black text-3xl">Gaia Token</h2>
            <h2 className="text-black">Saldo:</h2>
            <LocalBalanceToken/>
            <Mint/>
            <Burn/>
            <TotalSupply/>
            <ReadState/>
        </div>
    </div>
  );
};

export { Labs };
