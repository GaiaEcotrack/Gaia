import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { GasInfo, ProgramMetadata } from "@gear-js/api";
import useVoucherUtils from "@/pages/home/VouchersUtils";

function DeviceRegister() {
  const {
    createNewVoucher,
    voucherExpired,
    renewVoucherOneHour,
    voucherExists,
    accountVoucherId,
    addTwoTokensToVoucher
  } = useVoucherUtils();

  const URL = import.meta.env.VITE_APP_API_URL;
  const [foundUserId, setFoundUserId] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const [formData, setFormData] = useState({
    user_id: localStorage.getItem("id"),
    plant: {
      plantId: "",
      plantName: "",
      plantTimezone: "",
      description: "",
    },
    device: {
      deviceId: "",
      deviceName: "",
      deviceTimezone: "",
      serial: "",
      image: "",
    },
    sets: [""],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      device: {
        ...prevFormData.device,
        [name]: value,
      },
    }));
  };

  //VARA////////
  const alert = useAlert();
  const { accounts, account } = useAccount();
  const { api } = useApi();
  const programIDFT = import.meta.env.VITE_APP_MAIN_CONTRACT_ID;

  // Add your metadata.txt
  const meta = import.meta.env.VITE_APP_MAIN_CONTRACT_METADATA;
  const metadata = ProgramMetadata.from(meta);




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
        programIDFT,
        { newDevice: null },
        0,
        true,
        metadata
      );
      const transferExtrinsic = api.message.send(
        {
          destination: programIDFT, // programId
          payload: {
            newDevice: [
              formData.user_id,
              {
                id: formData.device.deviceId,
                name: formData.device.deviceName,
                typeEnergy: formData.device.deviceName,
                serial: formData.device.serial,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log('Datos del formulario a enviar:', formData);

    try {
      const userId = localStorage.getItem("id");

      let apiUrl = `${URL}/devices/`;
      let httpMethod = "POST";

      const response = await fetch(apiUrl, {
        method: httpMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: "Device added successfully",
        });
        signerVou();

        if (!userId) {
          Toast.fire({
            icon: "error",
            title: "Something went wrong",
          });
        }

        const hasFileInputs = Object.keys(selectedFiles).length > 0;

        if (hasFileInputs) {
          await handleSubmitBucket(e);
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  //* codigo para subir archivos al bucket

  const [selectedFiles, setSelectedFiles] = useState({});

  //* nueva funcion
  const handleInputChangeBucket = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, files } = event.target;

    if (type === "file") {
      // Actualiza el estado con el archivo seleccionado, usando el nombre del input como clave
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [name]: files && files.length > 0 ? files[0] : null, // Asume que solo se selecciona un archivo por input
      }));
    } else {
      // Para otros tipos de inputs, actualiza el estado formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // obtener le id del usiario del lcoalstorage luego de cargar
  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      setFoundUserId(userId);
    }
    setIsLoadingUser(false);
  }, []);
  async function handleSubmitBucket(e: any) {
    e.preventDefault();

    if (isLoadingUser) {
      console.error("El ID del usuario aún se está cargando");
      (window as any).alert(
        "Por favor, espera a que se cargue el ID del usuario."
      );
      return;
    }

    if (!foundUserId) {
      console.error("No se encontró el ID del usuario");
      (window as any).alert(
        "No se encontró el ID del usuario. Por favor, inténtalo de nuevo."
      );
      return;
    }

    let allFilesUploaded = true;

    // Itera sobre cada archivo seleccionado y envíalo
    for (const [inputName, file] of Object.entries(selectedFiles)) {
      if (file) {
        if (!(file instanceof Blob)) {
          console.error(`El archivo de ${inputName} no es un Blob válido.`);
          continue;
        }
        const formData = new FormData();
        formData.append("file", file);

        const uploadUrl = `${URL}/upload_image`;

        try {
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error(`No se pudo cargar el archivo de ${inputName}`);
          }

          const uploadData = await uploadResponse.json();
          console.log("URL a enviar:", uploadData.url);
          console.log(`Archivo de ${inputName} cargado con éxito:`, uploadData);

          // Envío la URL del archivo subido al backend para guardarla
          const tipoArchivo = inputName;
          try {
            const saveUrlResponse = await fetch(`${URL}/users/save_url`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: foundUserId,
                url: uploadData.url,
                tipo_archivo: tipoArchivo,
              }),
            });

            if (!saveUrlResponse.ok) {
              throw new Error(
                `Error al guardar la URL del archivo ${tipoArchivo} en la base de datos`
              );
            }

            console.log(
              `URL del archivo ${tipoArchivo} guardada con éxito en la base de datos`
            );
          } catch (error) {
            console.error(
              `Error al guardar la URL del archivo ${tipoArchivo} en la base de datos:`,
              error
            );
            (window as any).alert(
              `Error al guardar la URL del archivo ${tipoArchivo}. Por favor, inténtalo de nuevo.`
            );
            allFilesUploaded = false;
            break;
          }
        } catch (error) {
          console.error(`Error al cargar el archivo de ${inputName}:`, error);
          (window as any).alert(
            `Error al cargar el archivo de ${inputName}. Por favor, inténtalo de nuevo.`
          );
          allFilesUploaded = false;
          break;
        }
      }
    }

    if (allFilesUploaded) {
      Toast.fire({
        icon: "success",
        title: "Files saved successfully",
      });
    }
  }
  // fin codigo del bucket

  return (
    <div className=" w-full bg-white flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Profile</h2>

          <Link to="/userReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              User Account
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Credentials
            </h1>
          </Link>

          <Link to="/idVerification">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Identification
            </h1>
          </Link>

          <Link to="/security">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Security Settings
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/notifications">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
            PRO Account
          </h1>
          {/* </Link> */}
        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">
          <h2 className="flex justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4 mb-8">
            NEW DEVICE
          </h2>

          {/* Formulario de perfil público */}

          <div className="">
            <form
              className="grid sm:grid-cols-2 gap-x-14"
              action=""
              onSubmit={handleSubmit}
            >
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="deviceId"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Device Id
                </label>
                <input
                  onChange={handleInputChange}
                  name="deviceId"
                  type="number"
                  id="deviceId"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Device Id"
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="deviceName"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Device Name - Type
                </label>
                <input
                  onChange={handleInputChange}
                  name="deviceName"
                  type="text"
                  id="deviceName"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Device Name"
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="serialNumber"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Serial Number
                </label>
                <input
                  onChange={handleInputChange}
                  name="serial"
                  type="text"
                  id="serialNumber"
                  className="bg-indigo-50 border outline-none border-indigo-300  text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Serial Number"
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="image"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Upload an image of the device
                </label>
                <input
                  onChange={handleInputChangeBucket}
                  name="image"
                  type="file"
                  accept="image/jpeg, image/png"
                  id="image"
                  className="bg-indigo-50 border border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  // required
                />
              </div>

              <div className="flex justify-start w-full">
                <button
                  type="submit"
                  className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-28 mt-4"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export { DeviceRegister };
