  import { useEffect, useState } from 'react';
  import axios from 'axios';

  interface Plant {
    id: number;
    name: string;
    timezone: string;
  }

  const Plants = () => {
    const url = import.meta.env.VITE_APP_API_URL;
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
      const callPlants = async () => {
        try {
          const response = await axios.get<{ plants: Plant[] }>(`${url}/plants`);
          setPlants(response.data.plants);
        } catch (error) {
          console.error('Error fetching plants:', error);
        }
      };

      callPlants();
    }, [url]);

    return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
        <h4 className="mb-6 px-7.5 text-xl font-semibold text-black">
          Plants
        </h4>

        <div>
          {plants.map((plant) => (
            <div key={plant.id} className="px-7.5 py-2.5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD8O_5BqFwCBlIgLF3_Oj8x4yxSIB3ffPQ2w&usqp=CAU" alt="" className='w-6 h-6' />
                <div className="ml-[-12vh]">
                  <h5 className="text-sm font-medium text-black">{plant.name}</h5>
                  <p className="text-xs text-gray-500">{plant.timezone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Plants;