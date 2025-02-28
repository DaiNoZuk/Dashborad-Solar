import React from "react";

function CardContent({ label, data, style }) {
  const fixedtime = [
    "06.00",
    "06.30",
    "07.00",
    "07.30",
    "08.00",
    "08.30",
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
    "15.30",
    "16.00",
    "16.30",
    "17.00",
    "17.30",
    "18.00",
    "18.30",
    "19.00",
  ];

  // จัดเรียงข้อมูลให้ตรงกับ labels และไม่แสดงค่าที่ไม่มีข้อมูล
  const mappedDataPower = fixedtime.map((time) => {
    const found = data.find((item) => item.time === time);
    return found ? { time: time, value: found.p } : null; // ถ้าไม่มีข้อมูล ให้เป็น null (ไม่แสดง)
  }).filter(Boolean); // ลบค่าที่เป็น null ออก

  const mappedDataCurrent = fixedtime.map((time) => {
    const found = data.find((item) => item.time === time);
    return found ? { time: time, value: found.i } : null;// ถ้าไม่มีข้อมูล ให้เป็น null (ไม่แสดง)
  }).filter(Boolean); // ลบค่าที่เป็น null ออก

  const mappedDataVoltage = fixedtime.map((time) => {
    const found = data.find((item) => item.time === time);
    return found ? { time: time, value: found.v } : null;// ถ้าไม่มีข้อมูล ให้เป็น null (ไม่แสดง)
  }).filter(Boolean); // ลบค่าที่เป็น null ออก

  const getMappedData = () => {
    switch (label) {
      case "Power":
        return mappedDataPower;
      case "Current":
        return mappedDataCurrent;
      case "Voltage":
        return mappedDataVoltage;
      default:
        return [];
    }
  };

  // ดึงข้อมูลล่าสุดจากอาร์เรย์ที่ได้
  const mappedData = getMappedData();
  const latestEntry = mappedData.length
    ? mappedData.reduce(
        (latest, entry) => (entry.time > latest.time ? entry : latest),
        mappedData[0]
      )
    : { value: "0" };

  const renderLable = () => {
    switch (label) {
      case "Voltage":
        return <p>{latestEntry.value} V.</p>;
      case "Current":
        return <p>{latestEntry.value} mA.</p>;
      case "Power":
        return <p>{latestEntry.value} W.</p>;
      default:
        return null;
    }
  };

  return (
    <div className={`${style} px-4 py-2 text-center rounded-lg `}>
      <p>{label}</p>
      {renderLable()}
    </div>
  );
}

export default CardContent;
