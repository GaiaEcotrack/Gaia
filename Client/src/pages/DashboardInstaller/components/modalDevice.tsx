import React from 'react';

interface ModalDeviceProps {
  close: () => void;
  deviceData: {
    today_eq: string;
    month_eq: string;
    total_eq: string;
    real_power: string;
    co2_emission_reduction: string;
    plant_tree: string;
    data_time: string;
    plantName: string;
    location: string;
  };
}

const ModalDevice: React.FC<ModalDeviceProps> = ({ close, deviceData }) => {
  
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-96">
        <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
          <img
            src="https://images.unsplash.com/flagged/photo-1566838803980-56bfa5300e8c?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="solar-panel"
          />
        </div>
        <div className="p-4">
          <h6 className="mb-2 text-slate-800 text-xl font-semibold">
            {deviceData.plantName || 'Device Information'}
          </h6>
          <p className="text-slate-600">
            <strong>Ubicación: </strong>
            {deviceData.location || 'No especificada'}
          </p>
          <p className="text-slate-600">
            <strong>Energía generada hoy: </strong>
            {deviceData.today_eq} kWh
          </p>
          <p className="text-slate-600">
            <strong>Energía generada este mes: </strong>
            {deviceData.month_eq} kWh
          </p>
          <p className="text-slate-600">
            <strong>Energía total generada: </strong>
            {deviceData.total_eq} kWh
          </p>
          <p className="text-slate-600">
            <strong>Potencia actual: </strong>
            {deviceData.real_power} kW
          </p>
          <p className="text-slate-600">
            <strong>Reducción de CO₂: </strong>
            {deviceData.co2_emission_reduction} kg
          </p>
          <p className="text-slate-600">
            <strong>Última actualización: </strong>
            {deviceData.data_time}
          </p>
        </div>
        <div className="px-4 pb-4 pt-0 mt-2 flex items-center justify-center">
          <button
            onClick={close}
            className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDevice;
