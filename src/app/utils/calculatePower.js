export const calculatePower = (voltage, current) => {
  return voltage
    .map((vItem) => {
      // ค้นหาค่ากระแสที่มีเวลาเดียวกัน
      const matchingCurrent = current.find((cItem) => cItem.time === vItem.time);

      // ถ้ามีกระแสที่ตรงกับเวลาให้คำนวณกำลังไฟฟ้า
      if (matchingCurrent) {
        return {
          p: Number((vItem.v * matchingCurrent.i).toFixed(2)), // คำนวณกำลังไฟฟ้า
          time: vItem.time, // ใช้เวลาเดียวกัน
        };
      }

      return null; // ถ้าไม่มีค่าให้คืนค่า null เพื่อกรองออก
    })
    .filter(Boolean); // ลบค่า null ออกจากอาร์เรย์
};