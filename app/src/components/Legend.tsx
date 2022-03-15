import React from "react";

export const LEGEND_COLORS = ["#0d0887", "#7e03a8", "#cc4778", "#f89540"];
export const VELOCITY_BREAK_POINTS = [0, 1, 3, 5];

const Legend: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        margin: "auto",
        top: 24,
        right: 24,
        zIndex: 400,
        padding: 8,
        border: "1px solid gray",
        backgroundColor: "white",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {LEGEND_COLORS.map((color, i) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: color,
              width: 12,
              height: 12,
              marginRight: 8,
            }}
          ></div>
          {i < LEGEND_COLORS.length - 1
            ? `${VELOCITY_BREAK_POINTS[i]}-${VELOCITY_BREAK_POINTS[i + 1]}`
            : `${VELOCITY_BREAK_POINTS[i]}+ `}
          {` knots`}
        </div>
      ))}
    </div>
  );
};
export default Legend;
