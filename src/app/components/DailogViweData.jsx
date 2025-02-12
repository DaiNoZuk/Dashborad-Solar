import React, { useState } from "react";
import { db, deleteDoc, doc } from "../utils/firebaseConfig";
import { GrNext } from "react-icons/gr";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

const DialogViweData = ({ open, onClose, data }) => {
  if (!open) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10; // แสดงข้อมูลทีละ 10 รายการ

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // หาข้อมูลที่ต้องแสดงในหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "power_solar", id));
    } catch (error) {
      console.error(" Error deleting document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#21222D] p-6 rounded-lg w-[50rem] text-white shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Data Records</h2>

        {/* Table */}
        {loading ? (
      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    ) :<div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600 text-sm">
            <thead>
              <tr className="bg-[#171821] text-[#28AEF3]">
                <th className="border border-gray-600 p-2">ID</th>
                <th className="border border-gray-600 p-2">Current (I)</th>
                <th className="border border-gray-600 p-2">Voltage (V)</th>
                <th className="border border-gray-600 p-2">Power (P)</th>
                <th className="border border-gray-600 p-2">Date</th>
                <th className="border border-gray-600 p-2">Time</th>
                <th className="border border-gray-600 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="text-center border border-gray-600"
                  >
                    <td className="p-2 border border-gray-600">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-2 border border-gray-600">{item.i} A</td>
                    <td className="p-2 border border-gray-600">{item.v} V</td>
                    <td className="p-2 border border-gray-600">
                      {(item.i * item.v).toFixed(2)} W
                    </td>
                    <td className="p-2 border border-gray-600">
                      {item.create_date.split(" ")[0]}
                    </td>
                    <td className="p-2 border border-gray-600">{item.time}</td>
                    <td className="p-2 border border-gray-600">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-md"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-400">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-500"
            }`}
          >
            <MdOutlineArrowBackIosNew/>
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-500"
            }`}
          >
            <GrNext/>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogViweData;
