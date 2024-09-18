import { useState, useEffect } from "react";
import { ProgramMetadata, encodeAddress } from "@gear-js/api";
import { useApi, useAlert, useAccount } from "@gear-js/react-hooks";
import { useDispatch} from 'react-redux';
import axios from "axios";


function LocalBalanceToken() {

  const { account } = useAccount();

  const dispatch = useDispatch();



  const [balance, setBalance] = useState<any | undefined>(0);


  useEffect(() => {
    const fetchData = async ()=>{
      try {
        const api = import.meta.env.VITE_APP_API_EXPRESS
        const data =[`${account?.decodedAddress}`]
        console.log(data);
        
        const request = await axios.post(`${api}/service/query/GaiaService/TotalTokensEnergy`,data)
        const response = request.data
        setBalance(response)
dispatch({ type: 'SET_VALUE_GAIA', payload: response.totalTokensUserEnergy});
      } catch (error) {
        console.log(error);
        
      }
    }
    fetchData()
  }, [])

  return (
    <div>
              <h2 className="text-3xl text-slate-800">{balance.totalTokensUserEnergy}</h2>
              
    </div>
        
  );
}

export { LocalBalanceToken };
