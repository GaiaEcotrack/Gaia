import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTypewriter } from "react-simple-typewriter";

import arrow from "../../assets/arrow.png";
import { ApiLoader } from "../../components/loaders/api-loader/ApiLoader";
import { IoIosAddCircle } from "react-icons/io";
import { getAuth } from "firebase/auth";
import { fetchData } from "./Hoymiles";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface Dispositivo {
  id: number;
  model_no: string;
  hard_ver: string;
  productId: number;
  warn_data: object;
  soft_ver: string;
  dtu_sn: string;
  generatorPower: number;
  timezone: string;
}

const PanelUsuarioFinal = () => {
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const username = userRedux[0]?.username ?? "";

  const [devices, setDevices] = useState<Dispositivo[]>([]);
  const [microInverst, setMicroInverst] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Dispositivo | null>(null);
  const [name, setName] = useState("");
  const [userError, setUserError] = useState(false);

  useEffect(() => {
    const storedName = window.localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [typeEffect] = useTypewriter({
    words: [`Hello, ${name}!, Here you can check out your connections!⚙️`],
    loop: {},
    typeSpeed: 100,
    deleteSpeed: 40,
  });

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        if (username) {
          const data = await fetchData(username);
          setDevices(data.data);
          setMicroInverst(data.data[0].children);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [username]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const user = await auth.currentUser;

      if (user) {
        const data = await fetchData(username);
        setDevices(data.data);
        setMicroInverst(data.data[0].children);
      } else {
        console.error("User is not logged in");
        setUserError(true);
      }
    } catch (error) {
      console.error("Error updating devices:", error);
    } finally {
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

  const deviceImages = [
    "https://www.europe-solarshop.com/media/catalog/product/cache/1/image/600x/17f82f742ffe127f42dca9de82fb58b1/s/m/sma_sunny_tripower_6000tl_20.png",
    "https://i.ebayimg.com/images/g/GH4AAOSwPJlkeiH5/s-l1600.webp",
  ];

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <div className="text-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ApiLoader />
          </div>
        ) : userError ? (
          <div
            className="flex items-center justify-center min-h-screen"
            style={{
              backgroundImage: "url('https://w7.pngwing.com/pngs/702/783/png-transparent-high-voltage-sign-symbol-hazardous-dangerous-electricity-electrical-above-threshold.png')",
              filter: "brightness(1.2)",
              mixBlendMode: "multiply",
              backgroundSize: "30%",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex flex-col justify-center items-center text-center m-8">
              <h2 className="text-lg text-blue-900 bg-white p-4 rounded-md shadow-md mt-36">
                You have to log in to access this section.
              </h2>
              <NavLink to="/">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-8 py-2 px-4 rounded">
                  Go to login
                </button>
              </NavLink>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <img
                src="https://w7.pngwing.com/pngs/206/865/png-transparent-drawing-electrician-others-electrical-contractor-panel-industry.png"
                alt=""
                className="ml-24 w-24 h-auto brightness-110 mix-blend-multiply"
              />
              <span className="text-md mt-8 ml-24 text-emerald-600">{typeEffect}</span>
            </div>

            <div className="flex flex-col items-center justify-center mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 my-4">Your Devices</h1>
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

            <div className="flex items-center justify-start">
              <NavLink to="/deviceReg" className="flex items-center ml-24">
                <span>Add new device</span>
                <button className="ml-4">
                  <IoIosAddCircle className="w-8 h-8" />
                </button>
              </NavLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-20">
              {devices.map((device, index) => (
                <div
                  key={index}
                  className="border rounded-lg bg-white shadow-md p-4 cursor-pointer relative"
                  onClick={() => openModal(device)}
                >
                  <img
                    src="https://www.hoymiles.com/wp-content/uploads/2022/05/Hoymiles-logo.png"
                    alt="Hoymiles Logo"
                    className="absolute top-2 right-2 w-48 h-48"
                  />
                  <div className="flex items-center space-x-4">
                    <img
                      src={deviceImages[index % deviceImages.length]}
                      alt={`Imagen del dispositivo ${device.model_no}`}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{device.model_no}</h3>
                      <p className="text-sm text-gray-600">Type: {device.model_no}</p>
                      <p className="text-sm text-gray-600">Vendor: HoyMiles</p>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-600">
                    <p>Model: {device.model_no}</p>
                    <p>Serial: {device.sn || "None"}</p>
                    <p>Voltage: {device.generatorPower || "None"}</p>
                    <p>Timezone: {device.timezone}</p>
                    <p className={`font-semibold ${device.warn_data.connect ? "text-blue-600" : "text-gray-400"}`}>
                      {device.warn_data.connect ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                </div>
              ))}

              {microInverst.map((device, index) => (
                <div
                  key={index}
                  className="border rounded-lg bg-white shadow-md p-4 cursor-pointer relative"
                  onClick={() => openModal(device)}
                >
                  <img
                    src="https://www.hoymiles.com/wp-content/uploads/2022/05/Hoymiles-logo.png"
                    alt="Hoymiles Logo"
                    className="absolute top-2 right-2 w-48 h-48"
                  />
                  <div className="flex items-center space-x-4">
                    <img
                      src={deviceImages[index % deviceImages.length]}
                      alt={`Imagen del dispositivo ${device.model_no}`}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{device.model_no}</h3>
                      <p className="text-sm text-gray-600">Type: {device.model_no}</p>
                      <p className="text-sm text-gray-600">Vendor: HoyMiles</p>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-600">
                    <p>Model: {device.model_no}</p>
                    <p>Serial: {device.sn || "None"}</p>
                    <p>Voltage: {device.generatorPower || "None"}</p>
                    <p>Timezone: {device.extend_data.grid_name}</p>
                    <p className={`font-semibold ${device.warn_data.connect ? "text-blue-600" : "text-gray-400"}`}>
                      {device.warn_data.connect ? "Connected" : "Disconnected"}
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
                  <h3 className="text-lg font-semibold text-gray-800">{selectedDevice.model_no}</h3>
                  <p className="text-sm text-gray-600">Type: {selectedDevice.model_no}</p>
                  <p className="text-sm text-gray-600">Vendor: HoyMiles</p>
                </div>
              </div>
              <div className="mt-4 text-gray-600">
                <p>Model: {selectedDevice.model_no}</p>
                <p>Serial: {selectedDevice.sn || "None"}</p>
                <p>Voltage: {selectedDevice.generatorPower || "None"}</p>
                <p>Timezone: {selectedDevice.timezone}</p>
                <p className={`font-semibold ${selectedDevice.warn_data.connect ? "text-blue-600" : "text-gray-400"}`}>
                  {selectedDevice.warn_data.connect ? "Connected" : "Disconnected"}
                </p>
              </div>
              <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
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