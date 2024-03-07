import React, { useState, useEffect } from "react";

import TypesPay from "../../components/TypesPay";
import Membership from "../../components/Membership";

// Import utilities

function DashboardCard04() {
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState("");
  const [cardContent, setCardContet] = useState(false);



  const openCardPay = () => {
    setCardContet(true);
  };
 

  useEffect(() => {
    // Obtener el valor almacenado en localStorage cuando el componente se monta
    const datoAlmacenado = window.localStorage.getItem("name");

    // Establecer el estado con el valor de localStorage, si existe
    if (datoAlmacenado) {
      setName(datoAlmacenado);
    }
  }, []); // El segundo parámetro [] asegura que useEffect solo se ejecute una vez al montar el componente



  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
          Payment method
        </h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <div>
        <div className="flex gap-5 items-center justify-center">
          <div>
            <Membership openCard={openCardPay} />
          </div>
          {cardContent && (
                      <div>
                      <TypesPay/>
                    </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default DashboardCard04;
