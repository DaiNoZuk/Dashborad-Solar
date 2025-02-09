import React from "react";

function CardContent({ label, value, style }) {
  return (
    <div
      className={`${style} px-4 py-2 text-center rounded-lg `}
    >
      <p>{label}</p>
      <p>{value}</p>
    </div>
  );
}

export default CardContent;
