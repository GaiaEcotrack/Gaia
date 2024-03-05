import { useEffect, useState } from 'react';
import axios from 'axios';

interface Device {
  deviceId: string;
  isActive: boolean;
  name: string;
  product: string;
  productId: number;
  timezone: string;
  type: string;
  vendor: string;
  serial: string;
}

interface Plant {
  id: number;
  name: string;
  timezone: string;
  devices: Device[];
  plantId: string;
}

const Plants = () => {
  const url = import.meta.env.VITE_APP_API_URL;
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const callPlants = async () => {
      try {
        const response = await axios.get<{ plants: Plant[] }>(`${url}/plants`);
        const plantsWithDevices: Plant[] = [];
        for (const plant of response.data.plants) {
          const devicesResponse = await axios.get<{ devices: Device[] }>(
            `${url}/devices/plant-devices?plantId=${plant.plantId}`
          );
          const plantWithDevices = { ...plant, devices: devicesResponse.data.devices };
          plantsWithDevices.push(plantWithDevices);
        }
        setPlants(plantsWithDevices);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };
  
    callPlants();
  }, [url]);

  console.log(plants)

  return (
    <div className="col-span-12 rounded-sm border-stroke py-6 shadow-default dark:bg-boxdark xl:col-span-4">
      <div className='bg-white w-[10vh] text-center rounded-2xl'>
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black">
        Plants
      </h4>
      </div>

      <div className='text-black ml-[-2vh]'>
        {plants.map((plant, index) => (
          <div key={plant.id} className={`px-7.5 py-2.5 border-b mb-[5vh] ml-[-2.5vh] w-[190vh] border-gray-200 rounded-xl bg-white ${index !== 0 ? 'mt-4' : ''}`}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD8O_5BqFwCBlIgLF3_Oj8x4yxSIB3ffPQ2w&usqp=CAU" alt="" className='w-6 h-6' />
            <div className="flex items-center justify-between">
              <div className="ml-[1vh]">
                <h5 className="text-sm font-medium text-black ml-[5vh]">{plant.name}</h5>
                <p className="text-xs text-gray-500 ml-[5vh]">{plant.timezone}</p>
                <h1 className='ml-[3vh]'>Devices</h1>
                <div className="flex flex-wrap" style={{ gap: '1rem' }}>
                  {plant.devices.map((device) => (
                    <div key={device.deviceId} className='border border-black rounded-xl p-2 text-black' style={{ minWidth: '200px' }}>
                      <h1>Device Name: {device.name}</h1>
                      <p>Type: {device.type}</p>
                      <p>Product: {device.product}</p>
                      <p>Serial: {device.serial}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plants;
