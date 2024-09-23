import axios from 'axios'


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

  const fetchDataHoymilesDevices = async (user: any, setData: any, setLoading: any) => {
    try {
      const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
      const request = await axios.post(`${apiUrl}/api/device-info/hoymiles`, {
        user_name: user,
      });
  
      const response = request.data.data;
  
      // Mapeamos la respuesta a la interfaz Dispositivo
      const dispositivos: Dispositivo[] = response.map((device: any) => ({
        id: device.id,                            // 'id' directamente
        model_no: device.model_no,                // 'model_no' directamente
        hard_ver: device.hard_ver,                // 'hard_ver' directamente
        productId: Number(device.sn),             // 'sn' como 'productId'
        warn_data: device.warn_data,              // 'warn_data' directamente
        soft_ver: device.soft_ver,                // 'soft_ver' directamente
        dtu_sn: device.dtu_sn,                    // 'dtu_sn' directamente
        generatorPower: 0,                        // Asignar un valor por defecto o calcularlo si es necesario
        timezone: "",                             // Ajusta esto según corresponda
      }));
  
      setData(dispositivos);
      setLoading(false);
      return dispositivos;
    } catch (error) {
      console.log("Error fetching data:", error);
      setLoading(false); // Asegúrate de manejar el loading también en caso de error
    }
  };

const fetchDataGrowattDevice = async (username: any,setData:any,setLoading:any) => {
    try {
      const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
      const request = await axios.post(`${apiUrl}/api/real-time-data/growatt`, {
        user_client: username,
      });
      const response = request.data.data
  
      // Mapeamos la respuesta a la interfaz Dispositivo
      const deviceLogs = response.deviceLogs?.datas?.map((device: any) => ({
        id: Number(device.plantId),                // Asignamos 'plantId' a 'id'
        model_no: device.deviceType,               // 'deviceType' a 'model_no'
        hard_ver: device.deviceTypeIndicate,       // 'deviceTypeIndicate' a 'hard_ver'
        productId: Number(device.sn),              // 'sn' a 'productId'
        warn_data: {connect:true},                             // Aquí falta 'warn_data', puedes asignar un objeto vacío o mapear otro dato
        soft_ver: device.firmwareVersion,          // 'firmwareVersion' a 'soft_ver'
        dtu_sn: device.sn,                         // 'sn' a 'dtu_sn'
        generatorPower: 0,                         // 'generatorPower' no está en la respuesta, puedes asignar un valor predeterminado
        timezone: device.lastUpdateTime,           // 'lastUpdateTime' a 'timezone' o el campo adecuado
      }));
      setData(deviceLogs)
      setLoading(false)
      return deviceLogs;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
export {fetchDataHoymilesDevices ,fetchDataGrowattDevice}