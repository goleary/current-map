import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";

type ControlsProps = {
  dates: Date[];
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
};

const Controls: React.FC<ControlsProps> = ({
  dates,
  sliderValue,
  setSliderValue,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (!isPlaying) return;
    const thingy = setInterval(
      () =>
        setSliderValue((val) => {
          if (val === dates.length - 1) return 0;
          return val + 1;
        }),
      250
    );
    return () => clearInterval(thingy);
  }, [dates.length, isPlaying, setSliderValue]);

  return (
    <div
      style={{
        position: "absolute",
        margin: "auto",
        bottom: 40,
        left: 0,
        right: 0,
        zIndex: 400,
        width: "80%",
        padding: 8,
        border: "1px solid gray",
        backgroundColor: "white",
        borderRadius: 8,
      }}
    >
      {dateFormat(dates[sliderValue], "ddd, mmm dS, h:MM TT")}
      <input
        type="range"
        min={0}
        max={dates.length - 1}
        value={sliderValue}
        onChange={(event) => setSliderValue(parseInt(event.target.value, 10))}
        style={{ width: "100%" }}
      />
      <button onClick={() => setIsPlaying((val) => !val)}>
        {isPlaying ? "||" : "►"}
      </button>
    </div>
  );
};

export default Controls;
