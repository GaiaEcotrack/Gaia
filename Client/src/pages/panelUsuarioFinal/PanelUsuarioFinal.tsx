import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useTypewriter, Cursor } from "react-simple-typewriter";

// import Update from "../../assets/Update.svg";
// import back from "../../assets/back.svg";
import arrow from "../../assets/arrow.png";

import { ApiLoader } from "../../components/loaders/api-loader/ApiLoader";

// Definición de la interfaz Dispositivo
interface Dispositivo {
  deviceId: number;
  name: string;
  type: string;
  vendor: string;
  productId: number;
  isActive: boolean;
  product: string;
  serial: string;
  generatorPower: number;
  timezone: string;
}

const PanelUsuarioFinal = () => {
  // const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [devices, setDevices] = useState<Dispositivo[]>([]);
  // const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Dispositivo | null>(
    null
  );

  const [typeEffect] = useTypewriter({
    words: ["Hello, Gaia Ecotrack!", "Here you can check out your conections!⚙️"],
    loop: {},
    typeSpeed: 100,
    deleteSpeed: 40,
  });

  useEffect(() => {
    const fetchByAxios = async () => {
      try {
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(
          `${apiUrl}/devices/plant-devices?plantId=13`
        );
        setDevices(response.data.devices);
      } catch (error) {
        console.log(error);
      }
    };

    fetchByAxios();
  }, []);

  // useEffect(() => {
  //   if (menuAbierto !== null) {
  //     setScrollPosition(window.scrollY);
  //     window.scrollTo(0, 0);
  //   } else {
  //     window.scrollTo(0, scrollPosition);
  //   }
  // }, [menuAbierto, scrollPosition]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setTimeout(async () => {
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(
          `${apiUrl}/devices/plant-devices?plantId=35`
        );
        setDevices(response.data.devices);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const openModal = (device: Dispositivo) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  // Lista de imágenes de dispositivos (url)
  const deviceImages = [
    "https://www.europe-solarshop.com/media/catalog/product/cache/1/image/600x/17f82f742ffe127f42dca9de82fb58b1/s/m/sma_sunny_tripower_6000tl_20.png",
    "https://i.ebayimg.com/images/g/GH4AAOSwPJlkeiH5/s-l1600.webp",
    // ... y así sucesivamente para cada dispositivo
  ];

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <div className="text-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ApiLoader />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <img
                src="https://w7.pngwing.com/pngs/206/865/png-transparent-drawing-electrician-others-electrical-contractor-panel-industry.png"
                alt=""
                className="ml-24 w-24 h-auto brightness-110 mix-blend-multiply"
              />
              <span className="text-md mt-8 ml-24 text-emerald-600">
                {typeEffect}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 my-4">
                Your Devices
              </h1>
              <div className="flex space-x-4">
                <NavLink to="/home">
                  <button>
                    <img className="w-10 h-10 rounded-full" src={arrow} alt="Back" />
                  </button>
                </NavLink>
                <button
                  onClick={handleUpdate}
                  className="w-28 h-10 border-2 bg-emerald-500 rounded-full text-gray-900"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-20">
  {devices.map((device, index) => (
    <div
      key={index}
      className="border rounded-lg bg-white shadow-md p-4 cursor-pointer relative"
      onClick={() => openModal(device)}
    >
      {/* Imagen de SMA en el borde superior derecho */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Logo_SMA.svg/600px-Logo_SMA.svg.png"
        alt="SMA Logo"
        className="absolute top-2 right-2 w-12 h-auto"
      />

      {/* Contenido principal de la tarjeta */}
      <div className="flex items-center space-x-4">
        <img
          src={deviceImages[index % deviceImages.length]}
          alt={`Imagen del dispositivo ${device.name}`}
          className="w-16 h-16 object-cover rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {device.name}
          </h3>
          <p className="text-sm text-gray-600">
            Type: {device.type}
          </p>
          <p className="text-sm text-gray-600">
            Vendor: {device.vendor}
          </p>
        </div>
      </div>

      <div className="mt-4 text-gray-600">
        <p>Model: {device.product}</p>
        <p>Serial: {device.serial || "None"}</p>
        <p>Voltage: {device.generatorPower || "None"}</p>
        <p>Timezone: {device.timezone}</p>
        <p
          className={`font-semibold ${
            device.isActive ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {device.isActive ? "Connected" : "Disconnected"}
        </p>
      </div>
    </div>
  ))}
</div>
          </>
        )}

{isModalOpen && selectedDevice && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-blue-100 p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3 relative">
      {/* Imagen de SMA en el borde superior derecho del modal */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Logo_SMA.svg/600px-Logo_SMA.svg.png"
        alt="SMA Logo"
        className="absolute top-2 right-2 w-12 h-auto"
      />

      <div className="flex items-center space-x-4">
        <img
          src={deviceImages[selectedDevice.deviceId % deviceImages.length]}
          alt={`Imagen del dispositivo ${selectedDevice.name}`}
          className="w-16 h-16 object-cover rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedDevice.name}
          </h3>
          <p className="text-sm text-gray-600">Type: {selectedDevice.type}</p>
          <p className="text-sm text-gray-600">Vendor: {selectedDevice.vendor}</p>
        </div>
      </div>

      <div className="mt-4 text-gray-600">
        <p>Model: {selectedDevice.product}</p>
        <p>Serial: {selectedDevice.serial || "None"}</p>
        <p>Voltage: {selectedDevice.generatorPower || "None"}</p>
        <p>Timezone: {selectedDevice.timezone}</p>
        <p
          className={`font-semibold ${
            selectedDevice.isActive ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {selectedDevice.isActive ? "Connected" : "Disconnected"}
        </p>
      </div>

      <button
        onClick={closeModal}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}
      </div>
    </section>
  );
};

export default PanelUsuarioFinal;
