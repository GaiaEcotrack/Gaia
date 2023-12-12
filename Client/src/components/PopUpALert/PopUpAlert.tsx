import Alert from "../../assets/Alert.svg";
import ClosePopUp from "../../assets/ClosePopUp.svg";

interface PopupProps {
  onClose: () => void;
}

function PopUpALert({ onClose }:PopupProps)  {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-8 max-w-md w-[447px] h-[542px] rounded-[20px]">
        <div className="flex justify-end">
          <button type="button" className="text-xl text-red-500" onClick={onClose}>
            <img src={ClosePopUp} alt="" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 mb-8">
          <img className="" src={Alert} alt="" />
          <h2 className="text-2xl text-[#6F6F6F] text-[16px] mb-4">
            Establecer Alertas en:
          </h2>
        </div>
        <div className="mb-4">
          <h3 className="text-[#6F6F6F6B] font-medium">Alerta de produccion</h3>
          <div className="flex items-center border border-gray-300 p-2 w-full text-[#6F6F6F6B] rounded-[5px]">
            <input type="text" className="flex-1 pr-2 w-[314px] h-[59px]" placeholder="Ej. 100" />
            <span className="text-[#6F6F6F] border-l-2 pl-2 ">kWh</span>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-[#6F6F6F6B] font-medium">Alerta de Consumo</h3>
          <div className="flex items-center border border-gray-300 p-2 w-full text-[#6F6F6F6B] rounded-[5px]">
            <input type="text" className="flex-1 pr-2 w-[314px] h-[59px]" placeholder="Ej. 100" />
            <span className="text-[#6F6F6F] border-l-2 pl-2 ">kWh</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-16">
          <button
          type="button"
            className="bg-[#74C7ED] text-white py-2 px-4 rounded w-1/2 mx-"
            onClick={onClose}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export  {PopUpALert};
