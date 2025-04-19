import React, { useEffect, useState } from "react";

const fonts = ["lato", "arial", "sans", "serif", "raleway" ,"monospace"];
const fontSizes = [14, 18, 21, 24];
const defaultFont = "Lato";
const defaultFontSize = 18;

const Footer = ({ onFontChange, onFontSizeChange }) => {
  const [selectedFont, setSelectedFont] = useState(defaultFont);
  const [selectedFontSize, setSelectedFontSize] = useState(defaultFontSize);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (onFontChange) onFontChange(selectedFont);
    if (onFontSizeChange) onFontSizeChange(selectedFontSize);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleFontSizeChange = () => {
    const currentIndex = fontSizes.indexOf(selectedFontSize);
    const nextIndex = (currentIndex + 1) % fontSizes.length;
    const newSize = fontSizes[nextIndex];
    setSelectedFontSize(newSize);
    if (onFontSizeChange) onFontSizeChange(newSize);
  };

  const handleFontChange = (newFont) => {
    setSelectedFont(newFont);
    if (onFontChange) onFontChange(newFont);
  };

  const toggleFullscreen = () => {
    // const elem = document.documentElement;
    // if (!document.fullscreenElement) {
    //   elem.requestFullscreen().then(() => setIsFullscreen(true));
    // } else {
    //   document.exitFullscreen().then(() => setIsFullscreen(false));
    // }
    if (!isFullscreen){
      window.runtime.WindowFullscreen();
      setIsFullscreen(true);
    } else {
      window.runtime.WindowUnfullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-[#f0f0f0] text-sm">
      <div className="flex gap-4 items-center">
        <button
          onClick={handleFontSizeChange}
          className="px-2 py-0.5 rounded w-7 text-xs hover:bg-gray-100"
        >
          {selectedFontSize}px
        </button>

        <div className="flex gap-1 items-center">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => handleFontChange(f)}
              className={`px-2 py-0.5 rounded text-xs ${
                selectedFont === f
                  ? "font-semibold"
                  : "hover:bg-gray-50"
              }`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 rounded text-xs hover:bg-gray-100"
        >
          {formatTime(timeLeft)}
        </button>

        
        <button
          onClick={() => setTimeLeft(15 * 60)}
          className= {isRunning ?"rounded text-xl text-black hover:bg-gray-100" :  "rounded text-xl text-gray-500"}
        >
          ■
        </button>

        <button
          onClick={toggleFullscreen}
          className="px-3 py-1 rounded text-xs hover:bg-gray-100"
        >
          {isFullscreen ? "minimize" : "fullscreen"}
        </button>
      </div>
    </div>
  );
};

export default Footer;
