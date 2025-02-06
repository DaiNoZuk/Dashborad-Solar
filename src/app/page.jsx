"use client";
import { useEffect, useState } from "react";
import ChartLine from "./components/chartline";
import { calculatePower } from "./utils/calculatePower";

export default function Home() {
  const voltage = [
    4.09, 5.94, 5.71, 5.18, 5.71, 4.17, 6.17, 4.84, 6.97, 4.41, 6.94, 4.56,
    4.39, 4.13, 5.99, 6.95, 6.42, 4.61, 6.36, 5.18, 6.34, 4.73, 4.41
  ];
  const current = [
    238.3, 212.1, 226.8, 236.1, 214.3, 233.6, 222.8, 218.2, 210.9, 214.0, 221.5,
    236.1, 210.0, 220.8, 232.0, 214.1, 217.1, 221.8, 230.2, 222.7, 231.6 , 222.7, 231.6
  ];

  const [power, setPower] = useState([]);

  useEffect(() => {
    setPower(calculatePower(voltage, current));
  }, []);

  // const power =
  return (
    <div className="flex flex-col items-center justify-center w-screen gap-10">
      <div className="flex items-center justify-center gap-20">
        <div className=" px-4 py-2 text-center border-2 border-indigo-900 rounded-lg">
          <p>Latest value</p>
          <p>Votage : 4.73 V</p>
        </div>
        <div className="">
          <ChartLine dataSets={voltage} label={'Voltage Curve'} titleY={'Voltage (V)'}/>
        </div>
      </div>
      <div className="flex items-center justify-center w-screen gap-20">
        <div className=" px-4 py-2 text-center border-2 border-indigo-900 rounded-lg">
          <p>Latest value</p>
          <p>Current : 231.6 mA</p>
        </div>
        <div className="">
          <ChartLine dataSets={current} label={'Current Curve'} titleY={'Current (mA)'}/>
        </div>
      </div>
      <div className="flex items-center justify-center w-screen gap-20">
        <div className=" px-4 py-2 text-center border-2 border-indigo-900 rounded-lg">
          <p>Latest value</p>
          <p>Power : {power[22]?.toFixed(2)??0} W</p>
        </div>
        <div className="">
          <ChartLine dataSets={power} label={'Power Curve'} titleY={'Power (W)'}/>
        </div>
      </div>
    </div>
  );
}
