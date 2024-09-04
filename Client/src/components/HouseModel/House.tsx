import React from 'react';
import './styles.css'; // Si estás usando un archivo CSS separado para animaciones

const AnimatedHouse = () => {
  return (
    <div className="relative w-full h-64">
      <img
        src="/housedesing.png"
        alt="3D House"
        className="absolute inset-0 w-full h-full object-cover animate-moveUpDown"
      />
    </div>
  );
};

export default AnimatedHouse;
