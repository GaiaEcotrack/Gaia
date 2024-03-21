import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { decodeAddress, GasInfo, ProgramMetadata} from "@gear-js/api";
import { web3FromSource } from "@polkadot/extension-dapp";
import { useState } from "react";
import { AlertsTransaction } from "../../components/AlertModal/AlertsTransaction";
import useVoucherUtils from "./VouchersUtils";

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
  const {
    createNewVoucher,
    voucherExpired,
    renewVoucherOneHour,
    voucherExists,
    accountVoucherId,
    addTwoTokensToVoucher
  } = useVoucherUtils();

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



const gasToSpend = (gasInfo: GasInfo): bigint => {
  const gasHuman = gasInfo.toHuman();
  const minLimit = gasHuman.min_limit?.toString() ?? "0";
  const parsedGas = Number(minLimit.replaceAll(",", ""));
  const gasPlusTenPorcent = Math.round(parsedGas + parsedGas * 0.1);
  const gasLimit: bigint = BigInt(gasPlusTenPorcent);
  return gasLimit;
};

const claimVoucher = async (voucherId: string) => {
  if (!account || !api || !accounts) return;

  const localaccount = account?.address;
  const isVisibleAccount = accounts.some(
    (visibleAccount) => visibleAccount.address === localaccount
  );

  if (isVisibleAccount) {
    const { signer } = await web3FromSource(account.meta.source);
    const gas = await api.program.calculateGas.handle(
      account?.decodedAddress ?? "0x00",
      programIdKey,
      { transferred: null },
      0,
      true,
      metadata
    );
    const transferExtrinsic = api.message.send(
      {
        destination: programIdKey, // programId
        payload:{
          transferred: [
            decodeAddress(addresLocal),
            decodeAddress(accountTo),
            quantity,
          ],
        },
        gasLimit: gasToSpend(gas),
        value: 0,
      },
      metadata
    );
    const voucherTx = api.voucher.call(voucherId, {
      SendMessage: transferExtrinsic,
    });

    try {
      await voucherTx.signAndSend(
        account?.decodedAddress,
        { signer },
        ({ status, events }) => {
          if (status.isInBlock) {
            alert.success(`Transaction completed`);
          } else {
            console.log(`status: ${status.type}`);
            if (status.type === "Finalized") {
              alert.success(status.type);
            }
          }
        }
      );
    } catch (error: any) {
      console.log(" transaction failed", error);
      const errorString = await error.toString()
      const feesError = await  errorString.includes("Inability to pay some fees , e.g. account balance too low")

      if(feesError === true){
          await addTwoTokensToVoucher(voucherId)
          console.log("actualizado");      
      }
      
      alert.info("Retry your transaction")
    }
  } else {
    alert.error("Account not available to sign");
  }
};

const createVoucher = async () => {
  if (!api || !account) return;

  if (await voucherExists()) {
    console.log("Voucher already exists");

    const voucherId = await accountVoucherId();

    if (await voucherExpired(voucherId)) {
      console.log("Voucher expired");
      await renewVoucherOneHour(voucherId);
    }

    await claimVoucher(voucherId);

    return;
  }

  console.log("Voucher does not exists");

  try {
    const voucherId = await createNewVoucher();
    await claimVoucher(voucherId);
  } catch (error) {
    console.log("Error creating voucher");
  }
};

const signerVou = async () => {
  console.log("signer");
  if (!account || !accounts || !api) return;
  await createVoucher();
};


  return (
    <div>
    <button
    onClick={signerVou}
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


  
  