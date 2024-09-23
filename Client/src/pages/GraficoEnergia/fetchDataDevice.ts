import axios from "axios";

//Hoymiles fetch devices
export const fetchDataHoymiles = async (username:any , setData:any) => {

      try {
        const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
        const request = await axios.post(`${apiUrl}/api/real-time-data`, {
          user_name: username
        });
        const response = request.data.data;
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    
  };


  export const calculateEnergyDataHoymiles = (data:any) => {
    if (data) {
      const energyGenerated = (data.today_eq / 1000).toFixed(2);
      const energyGenerating = data.reflux_station_data.pv_power;
      const consumedCalculate = ((data.reflux_station_data.meter_b_in_eq / 1000) + (data.reflux_station_data.self_eq / 1000)).toFixed(2);
      const tokens = Math.floor(data.today_eq / 1000).toString();
      const carboon = "0"
      const deviceName = "No Data"
      return { energyGenerated, energyGenerating, consumedCalculate, tokens,carboon , deviceName};
    }
    return { energyGenerated: "0.00", energyGenerating: "0", consumedCalculate: "0.00", tokens: "0" ,carboon:"0",deviceName:"No Data" };
  };


//Growatt

export const fetchDataGrowatt = async (username:any , setData:any) => {

  try {
    const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
    const request = await axios.post(`${apiUrl}/api/real-time-data/growatt`, {
      user_client: username
    });
    const response = request.data.data;
    setData(response);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

};


export const calculateEnergyDataGrowatt = (data:any) => {

  if (data) {

    const energyGenerated =data.devices[0]?.eToday;
    const energyGenerating = data.devices[0]?.pac;
    const consumedCalculate = data.devices[0]?.eToday;
    const tokens = Math.floor(data.devices[0]?.eToday).toString();
    const carboon =data.plantData.obj.co2
    const deviceName =data.deviceLogs.datas[0]?.alias
    return { energyGenerated, energyGenerating, consumedCalculate, tokens,carboon , deviceName };
  }
  return { energyGenerated: "0.00", energyGenerating: "0", consumedCalculate: "0.00", tokens: "0" ,carboon: "0", deviceName:"No Data"};
};


