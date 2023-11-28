import { SetStateAction, useState } from "react";

function Search() {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("Compra");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
    setOpcionSeleccionada(event.target.value);
  };

  const handleEstadoChange = (event: { target: { value: SetStateAction<string> } }) => {
    setEstadoSeleccionado(event.target.value);
  };

  const handleFechaChange = (event: { target: { value: SetStateAction<string> } }) => {
    setFechaSeleccionada(event.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white w-[90%] sm:w-4/5 justify-around h-20 rounded-md mt-5 flex items-center gap-5 p-2.5">
        <div className="flex items-center justify-center p-5">
          <div className="rounded-lg p-5">
            <div className="flex ">
              <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="pointer-events-none absolute w-5 fill-gray-500 transition"
                >
                  <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z">a</path>
                </svg>
              </div>

              <input
                type="text"
                className="w-full max-w-[160px] bg-slate-200 text-black pl-2 text-base font-semibold outline-0"
                placeholder=""
                id="searchInput"
              />
              <input
                type="button"
                value="Search"
                className="bg-blue-500 p-2 rounded-tr-lg rounded-br-lg text-white font-semibold hover:bg-blue-800 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="sm:flex hidden gap-10">
          
        <div className="p-4  max-w-md mx-auto">
          <label
            htmlFor="opcionesCompra"
            className="block text-sm font-medium text-gray-700"
          >
            Comprar
          </label>
          <select
            id="opcionesCompra"
            value={opcionSeleccionada}
            onChange={handleChange}
            className="mt-1 text-black block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          >
            <option value="">Comprar</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>

        <div className="p-4  max-w-md mx-auto">
          <label
            htmlFor="opcionesEstado"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <select
            id="opcionesEstado"
            value={estadoSeleccionado}
            onChange={handleEstadoChange}
            className="mt-1 text-black block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          >
            <option value="">Estado</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>

        <div className="p-4  max-w-md mx-auto">
          <label
            htmlFor="opcionesFecha"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>
          <select
            id="opcionesFecha"
            value={fechaSeleccionada}
            onChange={handleFechaChange}
            className="mt-1 text-black block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          >
            <option value="">Fecha</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>
        </div>

      </div>
    </div>
  );
}

export { Search };