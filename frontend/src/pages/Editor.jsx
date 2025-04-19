import React, { useState } from "react";
import EditorComp from "../components/Editor/Editor";
import Footer from "../components/Footer/Footer";
import "./Editor.css";
// Accept selectedEntry as a prop
const Editor = ({ selectedEntry }) => {
  const [font, setFont] = useState("Lato");
  const [fontSize, setFontSize] = useState(18);

  return (
    <div className="main-container h-full bg-[#f0f0f0] flex flex-col">
      <div className="flex-grow"> {/* Wrapper div to allow EditorComp to grow */}
        {/* Pass selectedEntry down to EditorComp */}
        <EditorComp font={font} fontSize={fontSize} selectedEntry={selectedEntry} />
      </div>
      <Footer onFontChange={setFont} onFontSizeChange={setFontSize} /> {/* Footer remains at the bottom */}
    </div>
  );
};

export default Editor;
