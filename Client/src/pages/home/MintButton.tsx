
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ProgramMetadata, decodeAddress, GearKeyring } from "@gear-js/api";
import { Button } from "@gear-js/ui";


function Mint() {
  const alert = useAlert();
  const { accounts, account } = useAccount();
  const { api } = useApi();

   // Add your programID
   const programIDFT =
   "0xdd505254341a0cd5bec95f48cba6327749f53575f6769c195088bd3c94a73886";

  // Add your metadata.txt
 const meta =
 "000200010000000000010400000001070000000000000000010800000021092c000808696f18496e69744654000004013466745f70726f6772616d5f696404011c4163746f72496400000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c0000050300100808696f48416374696f6e4761696145636f747261636b00010c304e657747656e657261746f72080004011c4163746f724964000014012447656e657261746f720000003847656e6572617465456e65726779040018011075313238000100284765745265776172647304001801107531323800020000140808696f2447656e657261746f72000014010869641801107531323800011877616c6c657404011c4163746f72496400013c746f74616c5f67656e65726174656418011075313238000138617665726167655f656e657267791801107531323800011c726577617264731801107531323800001800000507001c0808696f484576656e74734761696145636f747261636b00010c28526567697374657265640000002447656e657261746564000100405265776172647347656e65726174656400020000200808696f38496f4761696145636f747261636b0000100158746f74616c5f656e657267795f67656e6572617465641801107531323800012c746f74616c5f757365727318011075313238000140746f74616c5f67656e657261746f72731801107531323800012867656e657261746f72732401645665633c284163746f7249642c2047656e657261746f72293e00002400000228002800000408041400"

  const metadata = ProgramMetadata.from(meta);

  console.log(metadata.types.state?.toString());
  
  const adress = account!.address

  const message: any = {
    destination: programIDFT, // programId
    payload: { getRewards:10},
    gasLimit: 69999819245,
    value: 0,
  };

  const messageTwo: any = {
    destination: programIDFT, // programId
    payload: { generateEnergy:1000},
    gasLimit: 69999819245,
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
    const isVisibleAccount = accounts.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount) {
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
    const isVisibleAccount = accounts.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(messageTwo, metadata);

      const injector = await web3FromSource(accounts[0].meta.source);

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

 
    
    