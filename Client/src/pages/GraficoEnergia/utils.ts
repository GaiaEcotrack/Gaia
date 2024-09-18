// utils.ts

// Opción para el gráfico de distribución de tipos de energía
export const getCarbonFootprintDonutOption = (co2EmissionReduction: number) => ({
    title: {
      text: 'Solar Energy',
      subtext: `CO2 Reduction: ${co2EmissionReduction.toFixed(2)} tons`,
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      subtextStyle: {
        fontSize: 14,
        color: '#666',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['CO2 Reduction'],
    },
    series: [
      {
        name: 'CO2 Emission Reduction',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: co2EmissionReduction, name: 'CO2 Reduction' },
        ],
      },
    ],
  });
  
export const getEnergyTypeOption = () => ({
    title: {
      text: 'Energy Type Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Energy Type',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Solar' },
          { value: 735, name: 'Wind' },
          { value: 580, name: 'Hydro' },
          { value: 484, name: 'Nuclear' },
          { value: 300, name: 'Coal' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });
  



export const getOption = () => {
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          color: "#ffffff",
        },
      },
      series: [
        {
          name: "Access Source",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: "#1D1B41",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 3000, name: "Wind Energy" },
            { value: 7000, name: "Thermal Energy" },
            { value: 10000, name: "Solar Energy" },
          ],
        },
      ],
    };
  };

  // Opción para el gráfico de consumo por día
  export const getDailyConsumptionOption = () => ({
    xAxis: {
      type: 'category',
      data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  });
  
  // Opción para el gráfico de intensidad energética
  export const getImprovedEnergyIntensityOption = (currentValue: any) => ({
    title: {
      text: 'Energy Intensity',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'], // Centro del gráfico
        radius: '90%',
        min: 0, // Valor mínimo del gauge
        max: 15, // Valor máximo del gauge
        pointer: {
          width: 5,
          length: '80%',
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: '#fff',
          },
        },
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d'],
            ],
          },
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: '#fff',
            width: 3,
          },
        },
        axisLabel: {
          color: '#fff',
          distance: -20,
          fontSize: 14,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} kW',
          color: '#fff',
          fontSize: 20,
          offsetCenter: [0, '-15%'],
        },
        data: [
          {
            value: currentValue, // Valor dinámico
          },
        ],
      },
    ],
  });
  
  // Opción para el gráfico de dispositivos activos por planta
  export const getPlantDataOption = (plantData: { name: string; activeDevices: number }[]) => ({
    xAxis: {
      type: 'category',
      data: plantData.map(plant => plant.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: plantData.map(plant => plant.activeDevices),
        type: 'bar',
      },
    ],
  });
  
  // Opción para el gráfico de uso de dispositivos por día
  export const getDeviceUsageOption = (deviceData: { name: string; usage: number }[]) => ({
    xAxis: {
      type: 'category',
      data: deviceData.map(device => device.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: deviceData.map(device => device.usage),
        type: 'bar',
      },
    ],
  });
  
export const getBarChartOption = (plantData: number[][]): any => {
    // Generando colores aleatorios para cada barra
    const colors = plantData.map(
      () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
        },
        formatter: function (params: any) {
          const dataIndex = params[0].dataIndex;
          const plantNumber = plantData[dataIndex][0];
          const metric = params[0].value.toFixed(2);
          return `${params[0].name}<br/> Plant Number: ${plantNumber}<br/>Metric: ${metric}`;
        },
      },
      xAxis: {
        type: "category",
        data: plantData.map((item) => item[2]),
        axisLabel: {
          interval: 0,
          rotate: 45,
          color: "#fff",
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Metric",
          type: "line",
          data: plantData.map((item, index) => ({
            value: item[1],
            itemStyle: {
              color: colors[index % colors.length], // Utiliza el arreglo fijo de colores
            },
            symbolSize: 10,
            showSymbol: true,
          })),
          lineStyle: {
            color: "#5470C6",
          },
          smooth: true,
        },
      ],
    };
  };