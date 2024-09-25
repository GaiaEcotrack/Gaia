import axios from 'axios';

interface DeviceData {
  today_eq: string;
  month_eq: string;
  total_eq: string;
  real_power: string;
  co2_emission_reduction: string;
  data_time: string;
  plantName: string;
  location: string;
}

// Función para obtener los datos del dispositivo Hoymiles
const fetchDataHoymilesInstaller = async (user: any): Promise<DeviceData | undefined> => {
  try {
    const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
    const request = await axios.post(`${apiUrl}/api/real-time-data`, {
      user_name: user,
    });
    
    const response = request.data.data;
    
    const deviceData: DeviceData = {
      today_eq: response.today_eq,
      month_eq: response.month_eq,
      total_eq: response.total_eq,
      real_power: response.real_power,
      co2_emission_reduction: response.co2_emission_reduction,
      data_time: response.data_time,
      plantName: "No data",
      location: "Colombia",
    };

    return deviceData;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

// Función para obtener los datos del dispositivo Growatt
const fetchDataGrowattInstaller = async (username: any): Promise<DeviceData | undefined> => {
  try {
    const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
    const request = await axios.post(`${apiUrl}/api/real-time-data/growatt`, {
      user_client: username,
    });
    
    const response = request.data.data;
    
    const deviceData: DeviceData = {
      today_eq: response.devices[0]?.eToday,
      month_eq: response.devices[0]?.eMonth,
      total_eq: response.devices[0]?.eTotal,
      real_power: response.devices[0]?.pac,
      co2_emission_reduction: response.plantData.obj.co2,
      data_time: response.devices[0]?.lastUpdateTime,
      plantName: response.devices[0]?.plantName,
      location: response.plantData.obj.city,
    };

    return deviceData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export { fetchDataHoymilesInstaller, fetchDataGrowattInstaller };
