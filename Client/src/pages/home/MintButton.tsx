import { useState } from "react";
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import {
  ProgramMetadata,
  decodeAddress,
  GearKeyring,
  GasInfo,
} from "@gear-js/api";
import { Button } from "@gear-js/ui";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VoucherIssued } from "@gear-js/api";
import useVoucherUtils from "./VouchersUtils";

function Mint() {
  const {
    createNewVoucher,
    voucherExpired,
    renewVoucherOneHour,
    voucherExists,
    accountVoucherId,
  } = useVoucherUtils();
  const alert = useAlert();
  const { accounts, account } = useAccount();
  const { api } = useApi();

  const [error, setError] = useState(null);


  const gasToSpend = (gasInfo: GasInfo): bigint => {
    const gasHuman = gasInfo.toHuman();
    const minLimit = gasHuman.min_limit?.toString() ?? "0";
    const parsedGas = Number(minLimit.replaceAll(",", ""));
    const gasPlusTenPorcent = Math.round(parsedGas + parsedGas * 0.1);
    const gasLimit: bigint = BigInt(gasPlusTenPorcent);
    return gasLimit;
  };


  const programIDFT =
    "0xef93543e0c2b0779c51719ea7624af9b99fc411e825a715165977c489ac72432";

  // Add your metadata.txt
  const meta =
    "0002000100000000000104000000010b0000000000000000010c0000002d1654000808696f18496e69744654000004013466745f70726f6772616d5f696404011c4163746f72496400000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c0000050300100808696f48416374696f6e4761696145636f747261636b00011c304e657747656e657261746f72080004011c4163746f724964000014012447656e657261746f720000003847656e6572617465456e6572677904001801107531323800010028476574526577617264730400180110753132380002002c5472616e736665727265640c0004011c4163746f724964000004011c4163746f72496400001801107531323800030018526577617264100004011c4163746f724964000004011c4163746f72496400001801107531323800001c01405472616e73616374696f6e73496e666f000400244e65774465766963650800200118537472696e67000024012c44657669636573496e666f000500485472616e73616374696f6e505f74776f5f50080004011c4163746f724964000028013c5472616e73616374696f6e7350325000060000140808696f2447656e657261746f72000014010869641801107531323800011877616c6c657404011c4163746f72496400013c746f74616c5f67656e65726174656418011075313238000138617665726167655f656e657267791801107531323800011c726577617264731801107531323800001800000507001c0808696f405472616e73616374696f6e73496e666f00000c0108746f04011c4163746f724964000118616d6f756e74180110753132380001086b77180110753132380000200000050200240808696f2c44657669636573496e666f00001001086964180110753132380001106e616d65200118537472696e6700012c747970655f656e65726779200118537472696e6700011873657269616c200118537472696e670000280808696f3c5472616e73616374696f6e73503250000014011066726f6d200118537472696e67000108746f200118537472696e670001086b771801107531323800011064617465200118537472696e6700011476616c75651801107531323800002c0808696f484576656e74734761696145636f747261636b00011c28526567697374657265640000002447656e657261746564000100405265776172647347656e65726174656400020044546f6b656e735472616e736665727265640c011066726f6d04011c4163746f724964000108746f04011c4163746f724964000118616d6f756e74180110753132380003001c436c61696d65640c0108746f04011c4163746f724964000118616d6f756e74180110753132380001086b77180110753132380004003844657669636552656769737465720400200118537472696e670005003c5472616e73616374696f6e735032500400200118537472696e6700060000300808696f38496f4761696145636f747261636b00001c0158746f74616c5f656e657267795f67656e6572617465641801107531323800012c746f74616c5f757365727318011075313238000140746f74616c5f67656e657261746f72731801107531323800012867656e657261746f72733401645665633c284163746f7249642c2047656e657261746f72293e00011c646576696365733c01685665633c28537472696e672c2044657669636573496e666f293e0001307472616e73616374696f6e734401805665633c284163746f7249642c205472616e73616374696f6e73496e666f293e0001407032705f7472616e73616374696f6e734c017c5665633c284163746f7249642c205472616e73616374696f6e73503250293e000034000002380038000004080414003c000002400040000004082024004400000248004800000408041c004c00000250005000000408042800";
  const metadata = ProgramMetadata.from(meta);

  const calculateGas = async ()=>{
    const gas = await api?.program.calculateGas.handle(
      account?.decodedAddress ?? "0x00",
      programIDFT,
      { reward: null },
      0,
      true,
      metadata
    );

    const calculoGas = Number(gasToSpend(gas))
    console.log(calculoGas + "este es el gas");
    
    const varaCost = 1000000000000
    console.log(calculoGas / varaCost);
    
  }


  const message: any = {
    destination: programIDFT, // programId
    payload: {
      generateenergy: 1000,
    },
    gasLimit: 9999819245,
    value: 0,
  };

  const messageTwo: any = {
    destination: programIDFT, // programId
    payload: { generateenergy: 1000000 },
    gasLimit: 5246462557,
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
    gasLimit: 2206058208,
    value: 0,
  };

  async function signer() {
    const localaccount = account?.address;
    const isVisibleAccount = accounts!.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount) {
      // Create a message extrinsic
      const transferExtrinsic = await api!.message.send(message, metadata);
      const keyring = await GearKeyring.fromSuri("//Bob");

      await transferExtrinsic.signAndSend(keyring, (event: any) => {
        console.log(event);

        try {
          alert.success("Successful transaction");
        } catch (error) {
          alert.error("Error");
        }
      });
    } else {
      alert.error("Account not available to sign");
    }
  }

  async function signerTwo() {
    const localaccount = account?.address;
    const isVisibleAccount = accounts?.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount && api) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(message, metadata);

      const injector = await web3FromSource(
        accounts?.[0]?.meta.source || "unknown"
      );

      transferExtrinsic
        .signAndSend(
          account?.address ?? alert.error("No account"),
          { signer: injector.signer },
          ({ status }: { status: any }) => {
            if (status.isInBlock) {
              alert.success(status.asInBlock.toString());
            } else {
              alert.info("In process");
              if (status.type === "Finalized") {
                alert.success(status.type);
              }
            }
          }
        )
        .catch((error: any) => {
          setError(error);
          console.log(error);
        });
    } else {
      alert.error("Account not available to sign");
    }
  }

  async function signerThree() {
    const localaccount = account?.address;
    const isVisibleAccount = accounts?.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount && api) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(messageTwo, metadata);

      const injector = await web3FromSource(
        accounts?.[0]?.meta.source || "unknown"
      );

      transferExtrinsic
        .signAndSend(
          account?.address ?? alert.error("No account"),
          { signer: injector.signer },
          ({ status }: { status: any }) => {
            if (status.isInBlock) {
              alert.success(status.asInBlock.toString());
            } else {
              alert.info("In process");
              if (status.type === "Finalized") {
                alert.success(status.type);
              }
            }
          }
        )
        .catch((error: any) => {
          alert.error(error);
        });
    } else {
      alert.error("Account not available to sign");
    }
  }
  console.log(account?.decodedAddress
  );

  // async function voucher() {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const programs = '0xe91a91009fc3a99a05c509feb1614141e898a2c9e7bca9227bc404ff65c047a1';
  //   const spenderAddress = '0xb40bdca758d89256b437f48db0900fc3c7408504e621b300de375e8059a27f55';
  //   const validForOneHour = (60 * 60) / 3;

  //   const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
  //   const { seed } = GearKeyring.generateSeed(mnemonic);

  //   const keyring = await GearKeyring.fromSeed(seed, 'admin');

  //   console.log(seed);

  //   const { extrinsic } = await api!.voucher.issue(account?.decodedAddress ?? "0x00", 100 * 10 ** 12, validForOneHour, [programs], true);

  //   try {

  //  await extrinsic.signAndSend(keyring, async ( events ) => {
  //   console.log(events.toHuman());

  //                       const extrinsicJSON: any = events.toHuman();
  //                       if (extrinsicJSON && extrinsicJSON.status !== "Ready") {
  //                           const objectKey = Object.keys(extrinsicJSON.status)[0];
  //                           if (objectKey === "Finalized") {
  //                               alert.success("Voucher created");
  //                               console.log("Voucher created");
  //                           }
  //                       }

  //   })

  //   } catch (error) {
  //     console.log(error);

  //   }

  // }

  //   const createNewVoucher = (): Promise<string> => {
  //     return new Promise(async (resolve, reject) => {
  //         if (!api || !account) {
  //             console.log("No se inicio la api o account");
  //             reject("Error creating voucher");
  //             return;
  //         }

  //         const creatingVoucherAlertId = alert.loading("Creating voucher");

  //         const programs = '0xe91a91009fc3a99a05c509feb1614141e898a2c9e7bca9227bc404ff65c047a1';
  //         // Se genera el "issue" para crear el voucher para el usuario
  //         // En este caso, para el main contract
  //         const voucherIssued =  await api.voucher.issue(
  //             account?.decodedAddress ?? "0x00",
  //             100 * 10 ** 12,
  //             1_200,
  //             [programs]
  //         );

  //         console.log("voucher issued");

  //         const mnemonic = 'sun pill sentence spoil ripple october funny ensure illness equal car demise';
  //     const { seed } = GearKeyring.generateSeed(mnemonic);

  //     const keyring = await GearKeyring.fromSeed(seed, 'admin');

  //         // Se firma el voucher con la cuenta del administrador para el main Contract

  //         try {
  //             await voucherIssued.extrinsic.signAndSend(
  //                 keyring,
  //                 async (event) => {
  //                     console.log(event.toHuman());
  //                     const extrinsicJSON: any = event.toHuman();
  //                     if (extrinsicJSON && extrinsicJSON.status !== "Ready") {
  //                         const objectKey = Object.keys(extrinsicJSON.status)[0];
  //                         if (objectKey === "Finalized") {
  //                             alert.remove(creatingVoucherAlertId);
  //                             alert.success("Voucher created");
  //                             console.log("Voucher created");
  //                             resolve(voucherIssued.voucherId);
  //                             console.log(resolve(voucherIssued.voucherId));

  //                         }
  //                     }
  //                 }
  //             );
  //         } catch (error: any) {
  //             console.error(`${error.name}: ${error.message}`);
  //             alert.remove(creatingVoucherAlertId);
  //             alert.error("Error creating voucher");
  //             reject("Error creating voucher");
  //         }
  //     });
  // }

  const registerUser = async (voucherId: string) => {
    if (!account || !api || !accounts) return;

    const localaccount = account?.address;
    const isVisibleAccount = accounts.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount) {
      const { signer } = await web3FromSource(account.meta.source);
      const gas = await api.program.calculateGas.handle(
        account?.decodedAddress ?? "0x00",
        programIDFT,
        { Reward: null },
        0,
        true,
        metadata
      );
      const MidWallet = import.meta.env.VITE_APP_MID_KEY;
      const transferExtrinsic = api.message.send(
        {
          destination: programIDFT, // programId
          payload: {
            Reward: [
              decodeAddress(MidWallet),
              account.decodedAddress,
              10,
              {
                to: account.decodedAddress,
                amount: 10,
                kw: 60000,
              },
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
              console.log(
                `Completed at block hash #${status.asInBlock.toString()}`
              );
              alert.success(`Block hash #${status.asInBlock.toString()}`);
            } else {
              console.log(`Current status: ${status.type}`);
              if (status.type === "Finalized") {
                alert.success(status.type);
              }
            }
          }
        );
      } catch (error: any) {
        console.log(":( transaction failed", error);
      }
    } else {
      alert.error("Account not available to sign");
    }
  };

  const setMainContractVoucher = async () => {
    if (!api || !account) return;

    if (await voucherExists()) {
      console.log("Voucher already exists");

      const voucherId = await accountVoucherId();

      if (await voucherExpired(voucherId)) {
        console.log("Voucher expired");
        await renewVoucherOneHour(voucherId);
      }

      await registerUser(voucherId);

      return;
    }

    console.log("Voucher does not exists");

    try {
      const voucherId = await createNewVoucher();
      await registerUser(voucherId);
    } catch (error) {
      console.log("Error creating voucher");
    }
  };

  const signerVou = async () => {
    console.log("signer");
    if (!account || !accounts || !api) return;
    await setMainContractVoucher();
  };

  const create = async () => {
    const { keyring, json } = await GearKeyring.create('keyringName', 'passphrase');
    const json2 = GearKeyring.toJson(keyring, 'passphrase');
    console.log(keyring);
    console.log(json);
    console.log(json2);
    
        
  }

  console.log(create());
  

  return (
    <div>
      <Button
        text="Sin Firma"
        className="bg-black"
        onClick={() => {
          signer();
        }}
      />
      ;
      <Button
        text="Con Firma"
        className="bg-black"
        onClick={() => {
          signerTwo();
        }}
      />
      ;{error && <div>Error: {error.toString()}</div>}{" "}
      {/* Muestra el error en el componente */}
      <Button
        text="Agregar liquidez"
        className="bg-black"
        onClick={() => {
          signerThree();
        }}
      />
      ;
      <Button
        text="Crear Voucher"
        className="bg-black"
        onClick={() => {
          signerVou();
        }}
      />
      ;
      <Button
        text="existe voucher"
        className="bg-black"
        onClick={() => {
          voucherExists();
        }}
      />
      ;
      <Button
        text="calcular gas"
        className="bg-black"
        onClick={() => {
          calculateGas();
        }}
      />
      ;
    </div>
  );
}

export { Mint };
