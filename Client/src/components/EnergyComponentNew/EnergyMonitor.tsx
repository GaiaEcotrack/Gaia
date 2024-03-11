// EnergyMonitor.tsx
import React,{useEffect, useState} from "react";
import axios from 'axios'
import "./EnergyMonitor.css";

interface EnergyMonitorProps {
  percentage: number;
  size: number;
}

const EnergyMonitor: React.FC<EnergyMonitorProps> = ({ percentage,size }) => {

  const [batteryStatus, setBatteryStatus] = useState("")



  useEffect(() => {
    const fetchDataBattery = async ()=>{
      try {
        const url = import.meta.env.VITE_APP_API_URL
        const response = await axios.get(`${url}//devices/battery?deviceId=19&setType=EnergyAndPowerBattery&period=Recent`)
        const data = response.data.set
        const batteryCharge = data.map(objeto => objeto.batteryStateOfCharge)
        setBatteryStatus(batteryCharge)
        
        
      } catch (error) {
        console.log(error);
        
        
      }
    }
    fetchDataBattery()
  }, [])

  

  const radius = size / 2 - 5; // El radio del círculo
  const strokeWidth = 10; // El ancho de la línea de progreso

  // Calcula la longitud de la circunferencia para el círculo completo
  const circumference = 2 * Math.PI * radius;

  // Calcula la longitud de la línea de progreso según el porcentaje proporcionado
  const progress = (batteryStatus[0] / 100) * circumference;
  

  return (
    <div className="w-72 h-72 gap-5 bg-black/20 rounded-lg flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-white">Battery status</h1>
      <svg height={size} width={size}>
      {/* Círculo exterior (background) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
      />

      {/* Línea de progreso */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#4FD1C5"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
      />

      {/* Texto de porcentaje */}
      <text x={size / 2} y={size / 2} textAnchor="middle" dy="5" fontSize="16" fill="#4FD1C5">
        {`${progress.toFixed(0)}%`}
      </text>
    </svg>
    </div>
  );
};

export default EnergyMonitor;
