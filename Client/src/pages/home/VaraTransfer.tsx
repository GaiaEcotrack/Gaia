
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { decodeAddress, ProgramMetadata } from "@gear-js/api";

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


function VaraTransfer({accountTo, quantity,state}:ModalTypes) {

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
 const programIDFT =
 "0xe5fd61567629a183c9caf022c3bed995a732814313785a1210c2ddbbf051a005";

// Add your metadata.txt
const meta =
"00010001000000000001030000000107000000000000000108000000a90b3400081466745f696f28496e6974436f6e66696700000c01106e616d65040118537472696e6700011873796d626f6c040118537472696e67000120646563696d616c73080108753800000400000502000800000503000c081466745f696f204654416374696f6e000118104d696e74040010011075313238000000104275726e040010011075313238000100205472616e736665720c011066726f6d14011c4163746f724964000108746f14011c4163746f724964000118616d6f756e74100110753132380002001c417070726f7665080108746f14011c4163746f724964000118616d6f756e74100110753132380003002c546f74616c537570706c790004002442616c616e63654f66040014011c4163746f724964000500001000000507001410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001801205b75383b2033325d0000180000032000000008001c081466745f696f1c46544576656e74000110205472616e736665720c011066726f6d14011c4163746f724964000108746f14011c4163746f724964000118616d6f756e74100110753132380000001c417070726f76650c011066726f6d14011c4163746f724964000108746f14011c4163746f724964000118616d6f756e74100110753132380001002c546f74616c537570706c790400100110753132380002001c42616c616e63650400100110753132380003000020081466745f696f3c496f46756e6769626c65546f6b656e00001801106e616d65040118537472696e6700011873796d626f6c040118537472696e67000130746f74616c5f737570706c791001107531323800012062616c616e6365732401505665633c284163746f7249642c2075313238293e000128616c6c6f77616e6365732c01905665633c284163746f7249642c205665633c284163746f7249642c2075313238293e293e000120646563696d616c730801087538000024000002280028000004081410002c00000230003000000408142400"

   const metadata = ProgramMetadata.from(meta);

   const addresLocal = account!.address




   

  const message: any = {
    destination: programIDFT, // programId
    payload: {
      transfer: [
        decodeAddress(addresLocal),
        decodeAddress(accountTo),
        quantity,
      ],
    },
    gasLimit:  899819245,
    value: 0,
  };



  const signer = async () => {
    pushData()
    if(accounts){

      const localaccount = account?.address;
      const isVisibleAccount = accounts.some(
        (visibleAccount) => visibleAccount.address === localaccount
        );
        
        if (isVisibleAccount && api) {
          // Create a message extrinsic
          const transferExtrinsic = await api.message.send(message, metadata);
          
          const injector = await web3FromSource(accounts[0].meta.source);
          
          transferExtrinsic
          .signAndSend(
            account?.address ?? alert.error("No account"),
            { signer: injector.signer },
            ({ status }: { status: any }) => {
              if (status.isInBlock) {
                
                alert.success(status.asInBlock.toString());
              } else {
                alert.info("in procces")
                
                if (status.type === "Finalized") {
                  alert.success(status.type);
                }
              }
            }
            )
            .catch((error: any) => {
              alert.error(error)
            });
          } else {
            alert.error("Account not available to sign");
          }
        } else {
          console.error("Account is undefined");
        }
        };
        
  return (
    <button
    onClick={signer}
    type="submit"
    className="bg-secondary text-white px-4 py-2 rounded-md mb-5"
  >
    Enviar
  </button>
  )
}

export { VaraTransfer };


  
  