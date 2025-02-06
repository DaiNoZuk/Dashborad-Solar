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
        fill: false,
        borderColor: "rgb(75, 192, 192)",
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
        display: true, // ✅ เปิดใช้งาน Title
        text: `${label}`, // ✅ ข้อความของหัวตาราง
        font: {
          size: 18, // ✅ ขนาดตัวอักษร
          weight: "bold", // ✅ ตัวหนา
        },
        color: "#333", // ✅ สีข้อความ
        padding: 20, // ✅ เพิ่ม padding รอบหัวตาราง
      },
      legend: {
        display: false, // ❌ ปิด Legend (กล่องสี + ข้อความ)
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: `${titleY}`,
        },
        display: true,
        min: min,
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
        display: true,
      },
    },
  };

  return (
    <div className="w-[400px] h-[250px] mx-auto">
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartLine;
