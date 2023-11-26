import React from "react";
import SideBar from "../home/SideBar";
import { Link } from "react-router-dom";

const Notificaciones = () => {
  const iconoStyle: React.CSSProperties = {
    margin: "auto",
    width: "30px",
    height: "30px",
    marginLeft: "200px",
    color: "black",
  };

  return (
    <div className="bg-slate-200 h-full">
      <SideBar />
      <Link to={"/notificacionesConfig"}>
        {/* <PiNutBold style={iconoStyle}/> */}
      </Link>
      <div className="flex items-center justify-center">
        <div className="flex text-[#696771] bg-[#DDDDDD] w-[800px] h-20 border border-solid border-[#000 ] items-center justify-center mt-40">
          <h1 className="m-5">El Precio de la Token Gaia Subió un 20%</h1>
          <h1>El token se revalorizó luego de la adopción masiva... 18:30</h1>
        </div>
      </div>
      <div className="flex items-center justify-center mt-[-162px]">
        <div className="flex text-[#696771] bg-white w-[800px] h-20 border border-solid border-[#000 ] items-center justify-center mt-40">
          <h1 className="m-5">El Precio de la Token Gaia Subió un 20%</h1>
          <h1>El token se revalorizó luego de la adopción masiva... 18:30</h1>
        </div>
      </div>
      <div className="flex items-center justify-center mt-[-162px]">
        <div className="flex text-[#696771] bg-white w-[800px] h-20 border border-solid border-[#000 ] items-center justify-center mt-40">
          <h1 className="m-5">El Precio de la Token Gaia Subió un 20%</h1>
          <h1>El token se revalorizó luego de la adopción masiva... 18:30</h1>
        </div>
      </div>
      <div className="flex items-center justify-center mt-[-162px]">
        <div className="flex text-[#696771] bg-white w-[800px] h-20 border border-solid border-[#000 ] items-center justify-center mt-40">
          <h1 className="m-5">El Precio de la Token Gaia Subió un 20%</h1>
          <h1>El token se revalorizó luego de la adopción masiva... 18:30</h1>
        </div>
      </div>
    </div>
  );
};

export { Notificaciones };
