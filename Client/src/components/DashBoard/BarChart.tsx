import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { BarChart2 } from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[]; borderColor: string; fill: boolean }[];
}

const BarChart: React.FC<{ data: ChartData }> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
