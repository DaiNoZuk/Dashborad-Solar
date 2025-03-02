"use client";
import { db, collection, onSnapshot } from "./utils/firebaseConfig";
import { useEffect, useState } from "react";
import ChartLine from "./components/chartline";
import { calculatePower } from "./utils/calculatePower";
import CardContent from "./components/cardContent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DialogAddData from "./components/DialogAddData";
import DialogViweData from "./components/DailogViweData";

export default function Home() {
  const [voltage, setVoltage] = useState([]);
  const [current, setCurrent] = useState([]);
  const [power, setPower] = useState([]);
  const [report, setReport] = useState([]);
  const [typeReport, setTypeReport] = useState("all");
  const [openReport, setOpenReport] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViweData, setOpenViweData] = useState(false);

  const handleSelectChange = (event) => {
    setTypeReport(event.target.value);
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

  const exportToExcel = () => {
    const formattedData = report.map((item, index) => {
      const [date, time] = item.create_date.split(" ");
      if (typeReport == "all") {
        return {
          ลำดับ: index + 1, // index+1
          วันที่: date, // dd/mm/yyyy
          เวลา: time, // hh:mm
          Current: item.i, // ค่า i
          Voltage: item.v, // ค่า v
          Power: item.p, // ค่า p
        };
      } else if (typeReport == "current") {
        return {
          ลำดับ: index + 1, // index+1
          วันที่: date, // dd/mm/yyyy
          เวลา: time, // hh:mm
          Current: item.i, // ค่า i
        };
      } else if (typeReport == "voltage") {
        return {
          ลำดับ: index + 1, // index+1
          วันที่: date, // dd/mm/yyyy
          เวลา: time, // hh:mm
          Voltage: item.v, // ค่า v
        };
      } else {
        return {
          ลำดับ: index + 1, // index+1
          วันที่: date, // dd/mm/yyyy
          เวลา: time, // hh:mm
          Power: item.p, // ค่า p
        };
      }
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Power Data");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, "PowerData.xlsx");
    setOpenReport(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "power_solar"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();

          // แปลง Firestore Timestamp เป็น Date object
          const createDate = docData.create_date?.seconds
            ? new Date(docData.create_date.seconds * 1000)
            : null;

          return {
            id: doc.id,
            i: docData.I,
            v: docData.V,
            create_date: createDate
              ? createDate
                  .toLocaleString("th-TH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // ใช้เวลาแบบ 24 ชั่วโมง
                  })
                  .replace(",", "") // ลบ "," ออกเพื่อให้เป็นรูปแบบที่ต้องการ
              : "N/A",
            time: createDate
              ? createDate
                  .toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(":", ".")
              : "N/A",
          };
        });

        const newData = filteredDate(data);

        const dataReport = newData.map((item) => ({
          ...item,
          p: Number((item.i * item.v)/1000).toFixed(2),
        }));
        const newCurrent = newData.map((item) => ({
          i: item.i,
          time: item.time,
        }));

        const newVoltage = newData.map((item) => ({
          v: item.v,
          time: item.time,
        }));
        console.log(newVoltage);

        setReport(dataReport);
        setCurrent(newCurrent);
        setVoltage(newVoltage);
        setPower(calculatePower(newVoltage, newCurrent));
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {}, [power]);

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-5 bg-[#171821] pb-20 pt-5">
      <div className="flex items-center justify-center gap-4 p-4 bg-[#21222D] rounded-2xl sm:w-[25rem] sm:gap-10 sm:p-2 sm:rounded-md">
        <button
          onClick={() => setOpenReport(!openReport)}
          className="px-4 py-2 text-center  rounded-lg bg-[#171821] text-[#FFFFFF]"
        >
          <p>report</p>
        </button>
        <button
          onClick={() => setOpenDialog(true)}
          className="px-4 py-2 text-center  rounded-lg bg-[#171821] text-[#FFFFFF]"
        >
          <p>AddData</p>
        </button>
        <button
          onClick={() => setOpenViweData(true)}
          className="px-4 py-2 text-center  rounded-lg bg-[#171821] text-[#FFFFFF]"
        >
          <p>ViweData</p>
        </button>
      </div>
      {openReport ? (
        <div className="flex items-center justify-center gap-10 p-2 bg-[#21222D] w-[30rem] rounded-md">
          <div className="flex items-center justify-center px-4 py-2 text-center gap-3 rounded-lg bg-[#171821] text-[#FFFFFF]">
            <p>TypeReport : </p>
            <select
              value={typeReport}
              onChange={handleSelectChange}
              className="bg-[#171821] text-[#28AEF3] outline-none border-2 border-[#28AEF3] rounded-lg px-4"
            >
              <option value="all">All</option>
              <option value="voltage">Voltage</option>
              <option value="current">Current</option>
              <option value="power">Power</option>
            </select>
          </div>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 text-center  rounded-lg bg-[#171821] text-[#FFFFFF]"
          >
            <p>save</p>
          </button>
        </div>
      ) : null}
      {/* Dialog Component */}
      <DialogAddData open={openDialog} onClose={() => setOpenDialog(false)} />

      <DialogViweData
        open={openViweData}
        onClose={() => setOpenViweData(false)}
        data={report}
      />
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col items-center justify-center gap-4 p-6 bg-[#21222D] sm:gap-10 sm:w-[30rem]">
          <CardContent
            label={"Voltage"}
            data={voltage}
            style={
              "bg-[#FCB8591E] border-[1px] border-[#FCB859] text-[#FCB859]"
            }
          />
          <div className="">
            <ChartLine
              dataSets={voltage}
              label={"Voltage Curve"}
              titleY={"Voltage (V)"}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-6 bg-[#21222D] sm:gap-10 sm:w-[30rem]">
          <CardContent
            label={"Current"}
            data={current}
            style={
              "bg-[#A9DFD81E] border-[1px] border-[#A9DFD8] text-[#A9DFD8]"
            }
          />
          <div className="">
            <ChartLine
              dataSets={current}
              label={"Current Curve"}
              titleY={"Current (mA)"}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-6 bg-[#21222D] sm:gap-10 sm:w-[30rem]">
          <CardContent
            label={"Power"}
            data={power}
            style={
              "bg-[#f2c8ed36] border-[1px] border-[#F2C8ED] text-[#F2C8ED]"
            }
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
    </div>
  );
}
