"use client";
import { db, collection, onSnapshot } from "./utils/firebaseConfig";
import { useEffect, useState } from "react";
import ChartLine from "./components/chartline";
import { calculatePower } from "./utils/calculatePower";
import CardContent from "./components/cardContent";

export default function Home() {
  const [voltage, setVoltage] = useState([]);
  const [current, setCurrent] = useState([]);
  const [power, setPower] = useState([]);

  const valueLastIndex = (value) => {
    const lastValue = value.length > 0 ? value[value.length - 1] : 0;
    return lastValue;
  };

  const filteredDate = (data) => {
    // ดึงวันที่ปัจจุบัน (รูปแบบเดียวกับใน API)
    const today = new Date();
    const todayStr = today.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // กรองข้อมูลให้เหลือเฉพาะวันที่วันนี้
    const todayData = data.filter((item) =>
      item.create_date.startsWith(todayStr)
    );

    // เรียงข้อมูลตามเวลา (เวลาน้อย -> มาก)
    const sortedData = todayData.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.create_date.split(" ")[1]}:00`);
      const timeB = new Date(`1970-01-01T${b.create_date.split(" ")[1]}:00`);
      return timeA - timeB;
    });

    return sortedData;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "power_solar"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
      
        // แปลง Firestore Timestamp เป็น Date object
        const createDate = docData.create_date?.seconds
          ? new Date(docData.create_date.seconds * 1000)
          : null;
      
        return {
          id: doc.id,
          i: docData.i,
          v: docData.v,
          create_date: createDate
            ? createDate.toLocaleString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // ใช้เวลาแบบ 24 ชั่วโมง
              }).replace(",", "") // ลบ "," ออกเพื่อให้เป็นรูปแบบที่ต้องการ
            : "N/A",
        };
      });
      console.log(data);

      const newData = filteredDate(data);
      const newCurrent = newData.map((item) => item.i);
      const newVoltage = newData.map((item) => item.v);

      setCurrent(newCurrent);
      setVoltage(newVoltage);
      setPower(calculatePower(newVoltage, newCurrent));
    });

    return () => unsubscribe(); 
  }, []);

  useEffect(() => {}, [power]);

  return (
    <div className="flex flex-col items-center justify-center w-screen gap-5 bg-[#171821] pb-20 pt-5">
      <div className="flex items-center justify-center gap-10 p-2 bg-[#21222D] w-[40rem]">
        <div className="px-4 py-2 text-center  rounded-lg bg-[#171821] text-[#FFFFFF]">
          <p>report</p>
        </div>
        <div className="flex items-center justify-center px-4 py-2 text-center gap-3 rounded-lg bg-[#171821] text-[#FFFFFF]">
          <p>TypeReport : </p>
          <select className="bg-[#171821] text-[#28AEF3] outline-none border-2 border-[#28AEF3] rounded-lg px-4">
            <option>All</option>
            <option>voltage</option>
            <option>current</option>
            <option>power</option>
          </select>
        </div>
        <button className="px-4 py-2 text-center  rounded-lg bg-[#171821] text-[#FFFFFF]">
          <p>save</p>
        </button>
      </div>
      <div className="flex items-center justify-center gap-10 p-6 bg-[#21222D] w-[40rem]">
        <CardContent
          label={"Votage"}
          value={`${valueLastIndex(voltage)} V`}
          style={"bg-[#FCB8591E] border-[1px] border-[#FCB859] text-[#FCB859]"}
        />
        <div className="">
          <ChartLine
            dataSets={voltage}
            label={"Voltage Curve"}
            titleY={"Voltage (V)"}
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-10 p-6 bg-[#21222D] w-[40rem]">
        <CardContent
          label={"Current"}
          value={`${valueLastIndex(current)} mA`}
          style={"bg-[#A9DFD81E] border-[1px] border-[#A9DFD8] text-[#A9DFD8]"}
        />
        <div className="">
          <ChartLine
            dataSets={current}
            label={"Current Curve"}
            titleY={"Current (mA)"}
          />
        </div>
      </div>
      <div className="flex items-center justify-center  gap-10 p-6 bg-[#21222D] w-[40rem]">
        <CardContent
          label={"Power"}
          value={`${valueLastIndex(power).toFixed(2)} W`}
          style={"bg-[#f2c8ed36] border-[1px] border-[#F2C8ED] text-[#F2C8ED]"}
        />
        <div className="">
          <ChartLine
            dataSets={power}
            label={"Power Curve"}
            titleY={"Power (W)"}
          />
        </div>
      </div>
    </div>
  );
}
