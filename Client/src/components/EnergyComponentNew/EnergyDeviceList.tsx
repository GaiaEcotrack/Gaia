import {useState,useEffect} from "react";
import axios from 'axios'
import { SlEnergy } from "react-icons/sl";
import { Link } from "react-router-dom";

const EnergyDeviceList = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Devices {
        name:string;

    }
    const url =import.meta.env.VITE_APP_API_URL
    const [devices, setDevices] = useState([])

    useEffect(() => {
        const fetchData = async ()=>{
            const response = await axios.get(`${url}/devices/plant-devices?plantId=35`)
            const data = response.data.devices
            const divicesPosition = [2,3,4]
            const divicesGenerators = divicesPosition.map(posicion => data[posicion])
            setDevices(divicesGenerators)
        }
        fetchData()
    }, [url])



  return (
    <div className="w-96 h-72 gap-10 bg-black/20 rounded-lg flex flex-col items-center justify-center">
     <h1 className="text-2xl font-bold text-white">Generating Devices</h1>
     <div className="flex flex-col gap-5 items-center justify-center">
        {devices.map((devices)=>(
            <Link to="/panelUsuarioFinal">
            <div
        role="alert"
        className="max-w-[300px] p-2 bg-indigo-800 rounded-full items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
      >
        <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
          <SlEnergy/>
        </span>
        <span className="font-semibold mr-2 text-left flex-auto">
          {devices.name}
        </span>
        <svg
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current opacity-75 h-4 w-4"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"></path>
        </svg>
      </div>
      </Link>
        ))}
     </div>
    </div>
  );
};

export default EnergyDeviceList;
