"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartLine = ({ dataSets, label, titleY, min }) => {
  const colorChart = (label) => {
    if (label == "Voltage Curve") {
      return {
        borderColor: "#FCB859",
        backgroundColor: "#FCB8591F",
      };
    } else if (label == "Current Curve") {
      return {
        borderColor: "#A9DFD8",
        backgroundColor: "#A9DFD81E",
      };
    } else {
      return {
        borderColor: "#F2C8ED",
        backgroundColor: "#f2c8ed36",
      };
    }
  };

  // X - axis lable
  const labels = [
    "09.00",
    "09.30",
    "10.00",
    "10.30",
    "11.00",
    "11.30",
    "12.00",
    "12.30",
    "13.00",
    "13.30",
    "14.00",
    "14.30",
    "15.00",
    "14.30",
    "15.00",
    "15.30",
    "16.00",
    "16.30",
    "17.00",
    "17.30",
    "18.00",
    "18.30",
    "19.00",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        // Title of Graph
        label: `${label}`,
        data: dataSets,
        fill: true,
        borderColor: colorChart(label).borderColor,
        backgroundColor: colorChart(label).backgroundColor,
        tension: 0.1,
      },
      // insert similar in dataset object for making multi line chart
    ],
  };

  // To make configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${label}`,
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#FFFFFF",
        padding: 10,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: `${titleY}`,
          color: "#FFFFFF",
        },
        display: true,
        min: min,
      },
      x: {
        title: {
          display: true,
          text: "Time",
          color: "#FFFFFF",
        },
        display: true,
      },
    },
  };

  return (
    <div className="w-[25rem] h-[15rem] bg-[#171821] px-2">
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartLine;
