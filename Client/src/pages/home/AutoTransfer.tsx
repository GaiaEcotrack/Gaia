
import { useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { GearKeyring } from "@gear-js/api";
import {
  web3Enable,
} from "@polkadot/extension-dapp";
import { Button } from "@gear-js/ui";
import { Card, Center, Heading, Input } from "@chakra-ui/react";

function TransferCard() {
  const [address, setAddress] = useState("");

  const [valueAmount, setValueAmount] = useState("");


  const wsEndpoint = "wss://testnet.vara-network.io";

  const transfer = async function main() {
    await web3Enable("my wallet");



    const wsProvider = new WsProvider(wsEndpoint);

    const api = await ApiPromise.create({ provider: wsProvider });

    const transferExtrinsic = api.tx.balances.transfer(
      address,
      Number(valueAmount) * 1000000000000
    );

    setValueAmount("");
    setAddress("");

    const mnemonic = 'hub next valid globe toddler robust click demise silent pottery inside brass';
    const keyring = GearKeyring.fromMnemonic(mnemonic, 'testing');

    const keyringPromise = await keyring

    await transferExtrinsic.signAndSend(keyringPromise,(event:any)=>{
        console.log(event.toHuman());
        
    })

    // const injector = await web3FromSource(accountextension.meta.source);

    // transferExtrinsic
    //   .signAndSend(
    //     accountextension.address,
    //     { signer: injector.signer },
    //     ({ status }) => {
    //       if (status.type === "Finalized") {
    //         alert.success(status.type);
    //       }
    //     }
    //   )
    //   .catch((error: any) => {
    //     console.log(":( transaction failed", error);
    //   });
  };

  const AddressInputChange = (event: any) => {
    setAddress(event.target.value);
  };

  const AmountInputChange = (event: any) => {
    setValueAmount(event.target.value);
  };

  return (
    <Card w="500px" h="200px">
      <Center>
        <Heading size="xs" textColor="black">
          Address
        </Heading>
      </Center>
      <Input value={address} onChange={AddressInputChange} />
      <Center>
        <Heading size="xs" textColor="black">
          Amount
        </Heading>
      </Center>
      <Input value={valueAmount} onChange={AmountInputChange} />
      <Center>
        <Button text="Send" onClick={() => transfer()} />
      </Center>
    </Card>
  );
}

export { TransferCard };

  