import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className="loader"
        style={{
          border: "4px solid #f3f3f3", 
          borderTop: "4px solid #4CAF50",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 1s linear infinite",
        }}
      ></div>
    </div>
  );
};

export default Loading;
