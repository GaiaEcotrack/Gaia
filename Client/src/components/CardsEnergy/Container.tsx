import React, { useState, useEffect } from 'react';
import CardConsume from './CardConsume';
import CardGenerated from './CardGenerated';
import CardEnergy from './CardEnergy';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from "../../store/index";
import { decodeAddress, GearApi, GearKeyring, ProgramMetadata } from '@gear-js/api';
import { useAccount, useApi } from '@gear-js/react-hooks';

interface Data {
  today_eq: number;
  reflux_station_data: {
    pv_power: number;
    meter_b_in_eq: number;
    self_eq: number;
  };
}


const Container: React.FC = (token) => {
  const [data, setData] = useState<Data | null>(null);
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  
  useEffect(() => {
    const fetchData = async () => {
      if (userRedux !== null) {
        try {
          const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
          const request = await axios.post(`${apiUrl}/api/real-time-data`, {
            user_name: userRedux[0].username,
          });
          const response = request.data.data;
          setData(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [userRedux]);

  const calculateEnergyData = (data: Data | null) => {
    if (data) {
      const energyGenerated = (data.today_eq / 1000).toFixed(2);
      const energyGenerating = data.reflux_station_data.pv_power;
      const consumedCalculate = ((data.reflux_station_data.meter_b_in_eq / 1000) + (data.reflux_station_data.self_eq / 1000)).toFixed(2);
      const tokens = Math.floor(data.today_eq / 1000).toString();
      return { energyGenerated, energyGenerating, consumedCalculate, tokens };
    }
    return { energyGenerated: "0.00", energyGenerating: "0", consumedCalculate: "0.00", tokens: "0" };
  };

  const { energyGenerated, energyGenerating, consumedCalculate, tokens } = calculateEnergyData(data);



const gasToSpend = (gasInfo) => {
  const gasHuman = gasInfo.toHuman();
  const minLimit = gasHuman.min_limit?.toString() ?? "0";
  const parsedGas = Number(minLimit.replaceAll(',', ''));
  const gasPlusTenPorcent = Math.round(parsedGas + parsedGas * 0.10);
  const gasLimit = BigInt(gasPlusTenPorcent);
  return gasLimit;
}
const {account}= useAccount()
const {api} = useApi()
const sendMessageContract = async () => {
  try {
    const programIDFT ='0x7f8ea31deff25f819e5a6496e5d960082168cab9c45e2e38b9251d742e1fff3f'
    const meta = '0002000100000000000105000000010d0000000000000000010e000000891c5c000808696f18496e6974465400000c013466745f70726f6772616d5f696404011c4163746f72496400012861646d696e5f696e666f04011c4163746f72496400013861646d696e5f70617373776f7264100118537472696e6700000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c0000050300100000050200140808696f48416374696f6e4761696145636f747261636b000120304e657747656e657261746f72080108696404011c4163746f72496400012467656e657261746f7218012447656e657261746f72000000304164646c6971756964697479080118737570706c791c01107531323800012070617373776f7264100118537472696e670001003c52656d6f76656c6971756964697479080118737570706c791c01107531323800012070617373776f7264100118537472696e67000200284765745265776172647310011474785f69642001304f7074696f6e3c547849643e000108746f04011c4163746f724964000118746f6b656e731c01107531323800012070617373776f7264100118537472696e670003002c5472616e7366657272656414011474785f69642001304f7074696f6e3c547849643e00011066726f6d04011c4163746f724964000108746f04011c4163746f724964000118616d6f756e741c01107531323800012070617373776f7264100118537472696e670004001852657761726410011474785f69642001304f7074696f6e3c547849643e000108746f04011c4163746f724964000118616d6f756e741c0110753132380001307472616e73616374696f6e732801405472616e73616374696f6e73496e666f000500244e65774465766963650801086964100118537472696e670001186465766963652c012c44657669636573496e666f000600405472616e73616374696f6e5054776f50080108696404011c4163746f72496400012c7472616e73616374696f6e30013c5472616e73616374696f6e7350325000070000180808696f2447656e657261746f72000014010869641c01107531323800011877616c6c657404011c4163746f72496400013c746f74616c5f67656e6572617465641c011075313238000138617665726167655f656e657267791c01107531323800011c726577617264731c01107531323800001c00000507002004184f7074696f6e04045401240108104e6f6e6500000010536f6d650400240000010000240000050600280808696f405472616e73616374696f6e73496e666f00000c0108746f04011c4163746f724964000118616d6f756e741c0110753132380001086b771c01107531323800002c0808696f2c44657669636573496e666f000010010869641c0110753132380001106e616d65100118537472696e6700012c747970655f656e65726779100118537472696e6700011873657269616c100118537472696e670000300808696f3c5472616e73616374696f6e73503250000014011066726f6d100118537472696e67000108746f100118537472696e670001086b771c01107531323800011064617465100118537472696e6700011476616c75651c0110753132380000340808696f484576656e74734761696145636f747261636b00012428526567697374657265640000002447656e657261746564000100405265776172647347656e65726174656400020044546f6b656e735472616e736665727265640c011066726f6d04011c4163746f724964000108746f04011c4163746f724964000118616d6f756e741c0110753132380003001c436c61696d65640c0108746f04011c4163746f724964000118616d6f756e741c0110753132380001086b771c0110753132380004003844657669636552656769737465720400100118537472696e670005003c5472616e73616374696f6e735032500400100118537472696e67000600144572726f720400100118537472696e670007001c537563636573730400100118537472696e6700080000380808696f38496f4761696145636f747261636b00001c0158746f74616c5f656e657267795f67656e6572617465641c01107531323800012c746f74616c5f75736572731c011075313238000140746f74616c5f67656e657261746f72731c01107531323800012867656e657261746f72733c01645665633c284163746f7249642c2047656e657261746f72293e00011c646576696365734401685665633c28537472696e672c2044657669636573496e666f293e0001307472616e73616374696f6e734c01805665633c284163746f7249642c205472616e73616374696f6e73496e666f293e0001407032705f7472616e73616374696f6e7354017c5665633c284163746f7249642c205472616e73616374696f6e73503250293e00003c000002400040000004080418004400000248004800000408102c004c000002500050000004080428005400000258005800000408043000'
    const metadata = ProgramMetadata.from(meta);

    const gas = await api.program.calculateGas.handle(
      decodeAddress('5CM3F7Rn2JNUTYfPLQ9a3L6mMVAiQQ2rWV1X2azmXyxTgmxF') ?? "0x00",
      programIDFT,
      {
        GetRewards: {
          tx_id: null,
          to: account?.decodedAddress,
          tokens: Number(tokens),
          password:"E15597AF98B7CC76E088FE55EE4A2E7BA8C73CF71264C272FE1FABBAF5111BA6"
        },
      },
      0,
      false,
      metadata
    );


    const message = {
      destination: programIDFT,
      payload: {
        GetRewards: {
          tx_id: null,
          to:account?.decodedAddress,
          tokens: Number(tokens),
          password:"E15597AF98B7CC76E088FE55EE4A2E7BA8C73CF71264C272FE1FABBAF5111BA6"
        },
      },
      gasLimit: gasToSpend(gas),
      value: 0,
    };

    const transferExtrinsic = await api.message.send(message, metadata);
    const {nonce} = await api.query.system.account("5CM3F7Rn2JNUTYfPLQ9a3L6mMVAiQQ2rWV1X2azmXyxTgmxF")

    const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
    const { seed } = GearKeyring.generateSeed(mnemonic);
    const keyring = await GearKeyring.fromSeed(seed, 'admin');

    return new Promise((resolve, reject) => {
      transferExtrinsic.signAndSend(keyring, {nonce: nonce}, ({ status }) => {
        if (status.isInBlock) {
          console.log("Transaction in the block");
        } else if (status.isFinalized) {
          alert("tokens enviados")
          console.log("Transaction completed");
          resolve(true);
        }
      }).catch(error => {
        console.error("Error al manejar evento de transacción:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error en sendMessageContract:", error);
    throw error; // Propagar el error para manejarlo adecuadamente en el contexto superior
  }
};




  return (
    <div className="flex flex-col lg:flex-row gap-5 p-2 justify-center graficos items-center">
      <CardGenerated total={energyGenerated} moment={energyGenerating} />
      <CardConsume supply={consumedCalculate} />
      <CardEnergy reward={sendMessageContract} supply={tokens} />
    </div>
  );
};

export default Container;
