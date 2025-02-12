import React, { useState } from "react";
import { db, collection, Timestamp, addDoc } from "../utils/firebaseConfig";

const DialogAddData = ({ open, onClose }) => {
  const [current, setCurrent] = useState("");
  const [voltage, setVoltage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  if (!open) return null; // ถ้า Dialog ไม่เปิด ให้ return null

  const time = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];

  // ฟังก์ชันรวมวันที่และเวลา
  const combineDateTime = (selectedDate, selectedTime) => {
    const dateTimeString = `${selectedDate}T${selectedTime}:00`;
    const dateObject = new Date(dateTimeString);
    if (isNaN(dateObject.getTime())) {
      return null;
    }

    return dateObject;
  };

  const handleSubmit = async () => {
    try {
      // ตรวจสอบว่ามีค่าหรือไม่
      if (!selectedDate || !selectedTime) {
        console.error("Error: Date or Time is missing");
        return;
      }

      const dateObject = combineDateTime(selectedDate, selectedTime);

      if (!dateObject) {
        console.error("Error: Invalid DateTime");
        return;
      }

      const data = {
        i: Number(current),
        v: Number(voltage),
        create_date: Timestamp.fromDate(dateObject), // แปลงเป็น Firestore Timestamp
      };
      await addDoc(collection(db, "power_solar"), data);
    } catch (error) {
      console.error("Error adding data:", error);
    } finally{
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#21222D] p-6 rounded-lg w-[22rem] text-white shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Data</h2>

        <div className="flex flex-col gap-4">
          <label>
            Current (I):
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                e.preventDefault();
                const value = e.target.value.replace(/[^0-9.]/g, ""); // กรองเฉพาะตัวเลข
                e.target.value = value;
                setCurrent(value);
              }}
              className="mt-1 p-2 w-full bg-[#171821] text-white border border-gray-600 rounded-md"
            />
          </label>

          <label>
            Voltage (V):
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                e.preventDefault();
                const value = e.target.value.replace(/[^0-9.]/g, ""); // กรองเฉพาะตัวเลข
                e.target.value = value;
                setVoltage(value);
              }}
              className="mt-1 p-2 w-full bg-[#171821] text-white border border-gray-600 rounded-md"
            />
          </label>

          <label>
            Date:
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 p-2 w-full bg-[#171821] text-white border border-gray-600 rounded-md"
            />
          </label>
          <label>
            Time:
            <select
              className="bg-[#171821] text-[#28AEF3] outline-none border-2 border-[#28AEF3] rounded-lg px-4 ml-4"
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {time.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogAddData;
