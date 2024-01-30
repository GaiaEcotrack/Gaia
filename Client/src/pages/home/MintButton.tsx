
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ProgramMetadata, decodeAddress, GearKeyring } from "@gear-js/api";
import { Button } from "@gear-js/ui";


function Mint() {
  const alert = useAlert();
  const { accounts, account } = useAccount();
  const { api } = useApi();

  const programIDFT = import.meta.env.VITE_APP_MAIN_CONTRACT_ID


  // Add your metadata.txt
  const meta = import.meta.env.VITE_APP_MAIN_CONTRACT_METADATA
  const metadata = ProgramMetadata.from(meta);

  console.log(metadata.types.state?.toString());
  
  

  const message: any = {
    destination: programIDFT, // programId
    payload: { getRewards:10},
    gasLimit: 69999819245,
    value: 0,
  };

  const messageTwo: any = {
    destination: programIDFT, // programId
    payload: { generateEnergy:1000000},
    gasLimit: 69999819245,
    value: 0,
  };

  const messageThree: any = {
    destination: programIDFT, // programId
    payload: {
      transferred: [
        decodeAddress("5HjNGPcdpphBeLq6ffechssztTar6e2xXuavMAdeo3JHGcdR"),
        decodeAddress("5GsNufPvdgNwvt3SvdmqsHEXDNwViytiJpXggWBoErSFUEaJ"),
        10,
      ],
    },
    gasLimit: 9999819245,
    value: 0,
  };






 async function signer(){
  const localaccount = account?.address;
  const isVisibleAccount = accounts!.some(
    (visibleAccount) => visibleAccount.address === localaccount
  );

  if (isVisibleAccount) {
    // Create a message extrinsic
    const transferExtrinsic = await api!.message.send(message, metadata);
    // const mnemonic = 'hub next valid globe toddler robust click demise silent pottery inside brass';
    const keyring = await GearKeyring.fromSuri('//Alice');

    await transferExtrinsic.signAndSend(keyring,(event:any)=>{
        console.log("transferencia a la cuenta local hecha");
        
        
        
    })
  } else {
    alert.error("Account not available to sign");
  }
  };

  async function signerTwo(){
    const localaccount = account?.address;
    const isVisibleAccount = accounts?.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount && api) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(messageThree, metadata);

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
          alert.error(error)
        });
    } else {
      alert.error("Account not available to sign");
    }
  };

  async function signerThree(){
    const localaccount = account?.address;
    const isVisibleAccount = accounts?.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount && api) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(messageTwo, metadata);

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
          alert.error(error)
        });
    } else {
      alert.error("Account not available to sign");
    }
  };

  return(
    <div>
      <Button text="Sin Firma" className="bg-black" onClick={()=>{signer()}} />;
      <Button text="Con Firma" className="bg-black" onClick={()=>{signerTwo()}} />;
      <Button text="Agregar liquidez" className="bg-black" onClick={()=>{signerThree()}} />;

    </div>
  )
}

export { Mint};

 
    
    