import React from "react";

const Title: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        top: 20,
        left: 0,
        right: 0,
        zIndex: 400,
        width: "fit-content",
        padding: 8,
        border: "1px solid gray",
        backgroundColor: "white",
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: "bold" }}>
        Salish Sea Current Predictions
      </div>
    </div>
  );
};
export default Title;
