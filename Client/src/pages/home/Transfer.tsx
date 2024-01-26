import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { decodeAddress, ProgramMetadata} from "@gear-js/api";
import { web3FromSource } from "@polkadot/extension-dapp";
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
  const programIdKey = import.meta.env.VITE_APP_MAIN_CONTRACT_ID


  // Add your metadata.txt
  const meta = import.meta.env.VITE_APP_MAIN_CONTRACT_METADATA


   const metadata = ProgramMetadata.from(meta!);

   const addresLocal = account!.address

  const message: any = {
    destination: programIdKey, // programId
    payload: {
      transferred: [
        decodeAddress(addresLocal),
        decodeAddress(accountTo),
        quantity,
      ],
    },
    gasLimit: 9999819245,
    value: 0,
  };

  async function signer(){
    pushData()
    const localaccount = account?.address;
    const isVisibleAccount = accounts?.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount && api) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(message, metadata);

      const injector = await web3FromSource(accounts?.[0]?.meta.source || 'unknown');

      transferExtrinsic
        .signAndSend(
          account?.address ?? alert.error("No account"),
          { signer: injector.signer },
          ({ status }: { status: any }) => {
            if (status.isInBlock) {
              alert.success(status.asInBlock.toString());
            } else {
                alert.info("In process")
              if (status.type === "Finalized") {
                alert.success(status.type);
              }
            }
          }
        )
        .catch((error: any) => {
          alert.error(error.toString());
        });
    } else {
      alert.error("Account not available to sign");
    }
};

  // const signer = async () => {
  //   pushData()
  //   const localaccount = account?.address;
  //   const isVisibleAccount = accounts.some(
  //     (visibleAccount) => visibleAccount.address === localaccount
  //   );

  //   if (isVisibleAccount) {
  //     // Create a message extrinsic
  //     const transferExtrinsic = await api.message.send(message, metadata);
  //     // const mnemonic = 'hub next valid globe toddler robust click demise silent pottery inside brass';
  //     const keyring = await GearKeyring.fromSuri('//Alice');
  
  //     await transferExtrinsic.signAndSend(keyring,(event:any)=>{
  //         console.log(event.toHuman());
  //         setAlertTransaction(true)
          
  //     })
  //   } else {
  //     alert.error("Account not available to sign");
  //   }
  // };

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


  
  