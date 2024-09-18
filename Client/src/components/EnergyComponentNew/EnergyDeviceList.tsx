import {useState,useEffect} from "react";
import axios from 'axios'
import { SlEnergy } from "react-icons/sl";
import { Link } from "react-router-dom";
import { fetchData } from "@/pages/panelUsuarioFinal/Hoymiles";
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


const EnergyDeviceList = () => {
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const username = Array.isArray(userRedux) && userRedux.length > 0
  ? userRedux[0]?.username ?? ""
  : "";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Devices {
        name:string;

    }
    const [devices, setDevices] = useState<Dispositivo[]>([]);
    const [microInverst, setMicroInverst] = useState([]);

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
        }
      };
  
      fetchDevices();
    }, [username]);



  return (
    <div className="">
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
          {devices.model_no}
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
