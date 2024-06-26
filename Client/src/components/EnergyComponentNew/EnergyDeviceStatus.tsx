import {useState, useEffect} from 'react'
import axios from 'axios'
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

const EnergyDeviceStatus = () => {

    const [selectedOption, setSelectedOption] = useState('recent');
    const [energy, setEnergy] = useState<any>("")
    const energyRedux = useSelector((state: RootState) => state.app.pvGeneration);

    const url = import.meta.env.VITE_APP_API_URL;


    const options = [
      { value: 'recent', label: 'Recent' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' },
      { value: 'total', label: 'Total' },
    ];
  
    const handleOptionChange = (option:any) => {
      setSelectedOption(option);
      // Aquí puedes realizar acciones adicionales según la opción seleccionada
    };
    
    useEffect(() => {
        const fetchEnergy = async () =>{
            if(selectedOption === 'recent'){
            setEnergy(energyRedux?.pvGenerationPower.toFixed(1)) 

                
            }
            if(selectedOption === 'month'){
        
                    const data = energyRedux?.pvGenerationPerMonth.set
                    let pvGeneration = 0
                    for (let i = 0; i < data.length; i++) {
                        pvGeneration += data[i].pvGeneration;
                      }
                    setEnergy(Math.round(pvGeneration))

            }
            if(selectedOption === 'year'){
                try {
                    const response = await axios.get(`${url}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Year?Date=2023`)
                    const data = response.data.set
                    let pvGeneration = 0
                    for (let i = 0; i < data.length; i++) {
                        pvGeneration += data[i].pvGeneration;
                      }
                    setEnergy(Math.round(pvGeneration))
                } catch (error) {
                    console.log(error);
                    
                }
                
            }
            if(selectedOption === 'total'){
                try {
                    const response = await axios.get(`${url}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Total`)
                    const data = response.data.set
                    let pvGeneration = 0
                    for (let i = 0; i < data.length; i++) {
                        pvGeneration += data[i].pvGeneration;
                      }
                    setEnergy(Math.round(pvGeneration))
                } catch (error) {
                    console.log(error);
                    
                }
                
            }

        }
        fetchEnergy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption])
    
    
    
  return (
    <div className='w-96 h-72 gap-10 bg-black/20 rounded-lg flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold text-white'>generated energy</h1>
        <h1 className='text-6xl font-bold text-white'>{0} k/w</h1>
        <div className="flex items-center space-x-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleOptionChange(option.value)}
          className={`${
            selectedOption === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } py-2 px-4 rounded focus:outline-none transition duration-300`}
        >
          {option.label}
        </button>
      ))}
    </div>
    </div>
  )
}

export default EnergyDeviceStatus