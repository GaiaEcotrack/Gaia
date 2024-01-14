import { useState } from "react";
import { GearApi } from "@gear-js/api";
import { Button } from "@gear-js/ui";

function GasData() {

  const [minlimit, setMinlimit] = useState<any | undefined>(0);

  const [reserved, setReserved] = useState<any | undefined>(0);
  const [burned, setBurned] = useState<any | undefined>(0);
  const [maybereturned, setMaybereturned] = useState<any | undefined>(0);
  const [waited, setWaited] = useState<any | undefined>();

  

  const getGasData = async () => {
    const gearApi = await GearApi.create({
      providerAddress: "wss://testnet.vara-network.io",
    });

    const codeId =
      "0x99fc27e0ec31bff69286e4e8eb788c4055aeb7e6e8634d1e4c766384a8963cd9";

    const gas = await gearApi.program.calculateGas.initCreate(
      "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
      codeId,
      "0x00",
      0,
      true
    );

    console.log(gas.toHuman());

    setMinlimit(gas.toHuman().min_limit);
    setMaybereturned(gas.toHuman().maybereturned);
    setBurned(gas.toHuman().burned);
    setReserved(gas.toHuman().reserved);
    setWaited(gas.toHuman().waited);
  };

  return (
    <div className="text-black">
      <h1>Gas fee</h1>
      <p> Minlimit: {minlimit}</p>
      <p> Reserved: {reserved}</p>
      <p> Burned: {burned}</p>
      <p> May be returned: {maybereturned}</p>
      <p> Waited: {waited}</p>
      <Button text="Get Gas Data" onClick={getGasData} />
    </div>
  );
}

export { GasData };


  