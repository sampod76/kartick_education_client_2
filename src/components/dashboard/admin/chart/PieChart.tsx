'use client';
import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

export default function PieChart() {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext('2d');

      const newChart = new Chart(context, {
        type: 'pie',
        data: {
          labels: ['John', 'Jane', 'Doe', 'Emily', 'Jack', 'David', 'Ruby'],
          datasets: [
            {
              label: 'Info',
              data: [34, 64, 23, 45, 67, 24, 64],
              backgroundColor: [
                'rgb(255, 99, 132, 0.2)',
                'rgb(255, 159, 64, 0.2)',
                'rgb(255, 205, 86, 0.2)',
                'rgb(75, 192, 192, 0.2)',
                'rgb(54, 162, 235, 0.2)',
                'rgb(153, 102, 255, 0.2)',
                'rgb(201, 203, 207, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          // responsive: true
        },
      });

      chartRef.current.chart = newChart;
    }
  }, []);

  // ! for download charts
  function handleDownload() {
    if (chartRef.current) {
      const file = chartRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = file;
      link.download = 'barChart.png';
      link.click();
    }
  }
  return (
    <div className="relative h-[35rem] w-[40vw">
      <canvas ref={chartRef} />
      {/* <button
                onClick={handleDownload}
                className="rounded-md bg-primary bg-opacity-25 p-3  border border-secondary"
            >
                Download Chart
            </button> */}
    </div>
  );
}
