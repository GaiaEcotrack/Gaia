import React, { useState, useEffect } from "react";
import BarChart from "../../charts/BarChart01";
import Steps from "../../components/Steps";
import TypesPay from "../../components/TypesPay";
import Membership from "../../components/Membership";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";

function DashboardCard04() {
  const [name, setName] = useState("");
  const [cardContent, setCardContet] = useState(false);
  const [cardPay, setCardPay] = useState(false);
  const [cardMember, setCardMember] = useState(false);


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

  const chartData = {
    labels: [
      "12-01-2020",
      "01-01-2021",
      "02-01-2021",
      "03-01-2021",
      "04-01-2021",
      "05-01-2021",
    ],
    datasets: [
      // Light blue bars
      {
        label: "Direct",
        data: [800, 1600, 900, 1300, 1950, 1700],
        backgroundColor: tailwindConfig().theme.colors.blue[400],
        hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
      // Blue bars
      {
        label: "Indirect",
        data: [4900, 2600, 5350, 4800, 5200, 4800],
        backgroundColor: tailwindConfig().theme.colors.indigo[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.indigo[600],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  };

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
