import { useState, useEffect } from "react";
import { ProgramMetadata, encodeAddress } from "@gear-js/api";
import { useApi, useAlert, useAccount } from "@gear-js/react-hooks";
import { useDispatch} from 'react-redux';


function LocalBalanceToken() {
  const { api } = useApi();
  const { account } = useAccount();

  const alert = useAlert();
  const dispatch = useDispatch();



  const [balance, setBalance] = useState<any | undefined>(0);



    // Add your programID
    const programIDFT =import.meta.env.VITE_APP_MAIN_CONTRACT_TOKEN_ID
 
   // Add your metadata.txt
  const meta =import.meta.env.VITE_APP_MAIN_CONTRACT_TOKEN_METADATA
 
  const metadata = ProgramMetadata.from(meta);
  


  
  const getBalance = () => {
    if (api) {
      api.programState
        .read({ programId: programIDFT, payload:{ "BalanceOf": account?.decodedAddress} }, metadata)
        .then((result: { toJSON: () => any; }) => {
          setBalance(result.toJSON());

          
        })
        .catch(({ message }: Error) => alert.error(message));
    }
      
  };


  useEffect(() => {
    getBalance();
    dispatch({ type: 'SET_VALUE_GAIA', payload: balance.balance });
  });

  return (
    <div>
              <h2 className="text-3xl text-slate-800">{balance.balance}</h2>
              
    </div>
        
  );
}

export { LocalBalanceToken };
