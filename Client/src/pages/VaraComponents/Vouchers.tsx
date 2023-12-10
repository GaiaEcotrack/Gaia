import { VoucherIssued, decodeAddress, } from '@gear-js/api';
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";


function Vouchers () {

    const View = async ()=>{
        const { accounts, account } = useAccount();
        const { api } = useApi();

        const programId = '0xd46f5f0fba63bff9a43f6d4cca46d09ef0955b024e1bb70851dad96391c69986';
        const accountId = decodeAddress('5HjNGPcdpphBeLq6ffechssztTar6e2xXuavMAdeo3JHGcdR')

        const voucherExists = await api.voucher.exists(programId, accountId);

        
        console.log(api.voucher.signAndSend);
        

    }
    
  return (
    <div>
        <button>generate voucher</button>
    </div>
  )
}

export  {Vouchers}