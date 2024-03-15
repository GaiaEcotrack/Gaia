
import {useState} from 'react'
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ProgramMetadata, decodeAddress, GearKeyring } from "@gear-js/api";
import { Button } from "@gear-js/ui";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VoucherIssued } from '@gear-js/api';

function Mint() {
  const alert = useAlert();
  const { accounts, account } = useAccount();
  const { api } = useApi();

  const [error, setError] = useState(null);

  console.log(account?.decodedAddress);
  
  
  

  const programIDFT = "0x633d0f014702f15973932d129e12f5c144124de630125239c764694a143c6a28"


  // Add your metadata.txt
  const meta = "000200010000000000010400000001090000000000000000010a0000005d0e3c000808696f18496e69744654000004013466745f70726f6772616d5f696404011c4163746f72496400000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c0000050300100808696f48416374696f6e4761696145636f747261636b000114304e657747656e657261746f72080004011c4163746f724964000014012447656e657261746f720000003847656e6572617465456e6572677904001801107531323800010028476574526577617264730400180110753132380002002c5472616e736665727265640c0004011c4163746f724964000004011c4163746f724964000018011075313238000300244e657744657669636508001c0118537472696e67000020012c44657669636573496e666f00040000140808696f2447656e657261746f72000014010869641801107531323800011877616c6c657404011c4163746f72496400013c746f74616c5f67656e65726174656418011075313238000138617665726167655f656e657267791801107531323800011c726577617264731801107531323800001800000507001c0000050200200808696f2c44657669636573496e666f00001001086964180110753132380001106e616d651c0118537472696e6700012c747970655f656e657267791c0118537472696e6700011873657269616c1c0118537472696e670000240808696f484576656e74734761696145636f747261636b00011428526567697374657265640000002447656e657261746564000100405265776172647347656e65726174656400020044546f6b656e735472616e736665727265640c011066726f6d04011c4163746f724964000108746f04011c4163746f724964000118616d6f756e741801107531323800030038446576696365526567697374657204001c0118537472696e6700040000280808696f38496f4761696145636f747261636b0000140158746f74616c5f656e657267795f67656e6572617465641801107531323800012c746f74616c5f757365727318011075313238000140746f74616c5f67656e657261746f72731801107531323800012867656e657261746f72732c01645665633c284163746f7249642c2047656e657261746f72293e00011c646576696365733401685665633c28537472696e672c2044657669636573496e666f293e00002c0000023000300000040804140034000002380038000004081c2000"
  const metadata = ProgramMetadata.from(meta);

  
  


  
  const message: any = {
    destination: programIDFT, // programId
    payload: { newDevice:["5HjNGPcdpphBeLq6ffechssztTar6e2xXuavMAdeo3JHGcdR",{"id": 1, "name":"sma-nico", "typeEnergy":"solar","serial":"248-SMA"},{"id": 2, "name":"sma-nico", "typeEnergy":"solar","serial":"248-SMA"}]},
    gasLimit: 9999819245,
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
        decodeAddress("5HTJkawMqHSvVRi2XrE7vdTU4t5Vq1EDv2ZDeWSwNxmmQKEK"),
        decodeAddress("5G8mzxiCCW4VALGRGdaqGPfrMLp7CeaVfk5XwPhDDaDyGEgE"),
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
    const transferExtrinsic = await api!.message.send(messageThree, metadata);
    const keyring = await GearKeyring.fromSuri('//Bob');

    await transferExtrinsic.signAndSend(keyring,(event:any)=>{
      console.log(event);
      
        try {
          alert.success('Successful transaction')
          
        } catch (error) {
          alert.error('Error')
          
        }
        
        
        
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
          setError(error)
          console.log(error);
          
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
  console.log(decodeAddress('5G8mzxiCCW4VALGRGdaqGPfrMLp7CeaVfk5XwPhDDaDyGEgE'));
  
  async function voucher() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const programs = '0xe91a91009fc3a99a05c509feb1614141e898a2c9e7bca9227bc404ff65c047a1';
    const spenderAddress = '0xb40bdca758d89256b437f48db0900fc3c7408504e621b300de375e8059a27f55';
    const validForOneHour = (60 * 60) / 3; 

    const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
    const { seed } = GearKeyring.generateSeed(mnemonic);

    const keyring = await GearKeyring.fromSeed(seed, 'admin');
    
    console.log(seed);
    
    const { extrinsic } = await api!.voucher.issue(account?.decodedAddress ?? "0x00", 100 * 10 ** 12, validForOneHour, [programs], true);

    try {
 
      
   await extrinsic.signAndSend(keyring, async ( events ) => {
    console.log(events.toHuman()); 
    
                        const extrinsicJSON: any = events.toHuman();
                        if (extrinsicJSON && extrinsicJSON.status !== "Ready") {
                            const objectKey = Object.keys(extrinsicJSON.status)[0];
                            if (objectKey === "Finalized") {
                                alert.success("Voucher created");
                                console.log("Voucher created");
                            }
                        }

    })

    } catch (error) {
      console.log(error);
      
    }
 
    
    
  }

  const createNewVoucher = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        if (!api || !account) {
            console.log("No se inicio la api o account");
            reject("Error creating voucher");
            return;
        }


        const creatingVoucherAlertId = alert.loading("Creating voucher");

        const programs = '0xe91a91009fc3a99a05c509feb1614141e898a2c9e7bca9227bc404ff65c047a1';
        // Se genera el "issue" para crear el voucher para el usuario
        // En este caso, para el main contract
        const voucherIssued =  await api.voucher.issue(
            account?.decodedAddress ?? "0x00",
            100 * 10 ** 12, 
            1_200, 
            [programs]
        );

        console.log("voucher issued");

        const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
    const { seed } = GearKeyring.generateSeed(mnemonic);

    const keyring = await GearKeyring.fromSeed(seed, 'admin');

        // Se firma el voucher con la cuenta del administrador para el main Contract

        try {
            await voucherIssued.extrinsic.signAndSend(
                keyring,
                async (event) => {
                    console.log(event.toHuman()); 
                    const extrinsicJSON: any = event.toHuman();
                    if (extrinsicJSON && extrinsicJSON.status !== "Ready") {
                        const objectKey = Object.keys(extrinsicJSON.status)[0];
                        if (objectKey === "Finalized") {
                            alert.remove(creatingVoucherAlertId);
                            alert.success("Voucher created");
                            console.log("Voucher created");
                            resolve(voucherIssued.voucherId);
                        }
                    }
                }
            );
        } catch (error: any) {
            console.error(`${error.name}: ${error.message}`);
            alert.remove(creatingVoucherAlertId);
            alert.error("Error creating voucher");
            reject("Error creating voucher");
        }
    });
}
  
  return(
    <div>
      <Button text="Sin Firma" className="bg-black" onClick={()=>{signer()}} />;
      <Button text="Con Firma" className="bg-black" onClick={()=>{signerTwo()}} />;
      {error && <div>Error: {error.toString()}</div>} {/* Muestra el error en el componente */}
      <Button text="Agregar liquidez" className="bg-black" onClick={()=>{signerThree()}} />;
      <Button text="Crear Voucher" className="bg-black" onClick={()=>{createNewVoucher()}} />;


    </div>
  )
}

export { Mint};

 
    
    