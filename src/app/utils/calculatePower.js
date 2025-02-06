export const calculatePower = (voltage, current) => {
    return voltage.map((v, index) => v * (current[index] || 0));
  };