import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setDeviceType } from './store'; // Ajusta la ruta según tu estructura de archivos

const SelectOptions = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state: RootState) => state.app.loggedInUser);
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    { id: 1, name: 'Hoymiles', available: true },
    { id: 2, name: 'Opción 2', available: false },
    { id: 3, name: 'Opción 3', available: true },
    { id: 4, name: 'Opción 4', available: false },
    { id: 5, name: 'Opción 5', available: true },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    const selectedDeviceType = options.find(option => option.id.toString() === selectedValue)?.name || null;
    dispatch({ type: "SET_DEVICE_TYPE", payload: selectedDeviceType });
  };

  return (
    <div className="w-64 mx-auto mt-10">
      <label htmlFor="options" className="block text-sm font-medium text-gray-700">
        Seleccione una opción
      </label>
      <select
        id="options"
        value={selectedOption}
        onChange={handleChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>
          -- Seleccione --
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} disabled={!option.available}>
            {option.name} {option.available ? '(Disponible)' : '(No Disponible)'}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOptions;
