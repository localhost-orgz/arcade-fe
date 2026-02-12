import React from "react";

const ARCamera = ({ model, scale, marker }) => {
  return (
    <div className="relative">
      <iframe
        src={`https://badzlan.github.io/ar-system?model=${model}&scale=${scale}&marker=${marker}`}
        width="100%"
        height="600px"
        title="AR"
        className="rounded-xl my-5"
        allow="camera; microphone; fullscreen; xr-spatial-tracking;"
      ></iframe>
      <div className="h-full w-full absolute top-0 left-0 bg-transparent"></div>
    </div>
  );
};

export default ARCamera;
