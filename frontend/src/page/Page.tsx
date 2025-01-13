import React from "react";

export const Page: React.FC = () => {
  const onClick = () => {
    alert("押され番長");
  };

  return (
    <>
      <div>こここ人んちなh</div>
      <button onClick={onClick} />
    </>
  );
};
