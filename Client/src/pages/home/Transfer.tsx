
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { decodeAddress, ProgramMetadata, GearKeyring } from "@gear-js/api";
import { useState } from "react";
import { AlertsTransaction } from "../../components/AlertModal/AlertsTransaction";

interface ModalTypes {
  accountTo: string,
  quantity:number,
  state:object
}
interface Transaccion {
  From: string;
  usuario: string;
  cantidad: any;
  tipo: string;
  total: any;
}


function Transfer({accountTo, quantity,state}:ModalTypes) {

  const [alertTransaction, setAlertTransaction] = useState(false)

  const onClose = ()=>{
    setAlertTransaction(false)
  }

  const pushData = () => {
    // No cambies esta lógica, ya que se está utilizando localStorage directamente
    try {
      const datosActuales: Transaccion[] = JSON.parse(localStorage.getItem('transacciones') || '[]');

      const nuevosDatos: Transaccion[] = [...datosActuales, state as Transaccion];

      localStorage.setItem('transacciones', JSON.stringify(nuevosDatos));
    } catch (error:any) {
      return error
    }
  };
  const alert = useAlert();
  const { accounts, account } = useAccount();
  const { api } = useApi();
  // Add your programID
  const programIdKey = process.env.REACT_APP_PROGRAM_ID


  // Add your metadata.txt
   const meta = process.env.REACT_APP_META_DATA


   const metadata = ProgramMetadata.from(meta!);

   const addresLocal = account!.address

   const gasLimit = 375076928
   const percentage = 0.90
   const gasTotal = gasLimit * (1+percentage)
   const gasUsage = Math.round(gasTotal)

  const message: any = {
    destination: programIdKey, // programId
    payload: {
      transfer: [
        decodeAddress(addresLocal),
        decodeAddress(accountTo),
        quantity,
      ],
    },
    gasLimit: gasUsage,
    value: 0,
  };



  const signer = async () => {
    pushData()
    const localaccount = account?.address;
    const isVisibleAccount = accounts.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(message, metadata);
      // const mnemonic = 'hub next valid globe toddler robust click demise silent pottery inside brass';
      const keyring = await GearKeyring.fromSuri('//Alice');
  
      await transferExtrinsic.signAndSend(keyring,(event:any)=>{
          console.log(event.toHuman());
          setAlertTransaction(true)
          
      })
    } else {
      alert.error("Account not available to sign");
    }
  };

  return (
    <div>
    <button
    onClick={signer}
    type="submit"
    className="bg-secondary text-white px-4 py-2 rounded-md mb-5"
  >
    Enviar
  </button>
  {alertTransaction && (
    <AlertsTransaction onClose={onClose}/>
  )}
</div>
  )
}

export { Transfer };


  
  