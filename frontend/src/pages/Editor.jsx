import React, { useState } from "react";
import EditorComp from "../components/Editor/Editor";
import Footer from "../components/Footer/Footer";
import "./Editor.css";

const Editor = ({ selectedEntry }) => {
  const [font, setFont] = useState("Lato");
  const [fontSize, setFontSize] = useState(18);
  const [currentContent, setCurrentContent] = useState(""); // State to hold editor content

  return (
    <div className="main-container h-full bg-[#f0f0f0] flex flex-col">
      <div className="flex-grow"> 
        {/* Pass handler to EditorComp */}
        <EditorComp 
          font={font} 
          fontSize={fontSize} 
          selectedEntry={selectedEntry} 
          onContentChange={setCurrentContent} // Pass setter function
        />
      </div>
      {/* Pass currentContent to Footer */}
      <Footer 
        onFontChange={setFont} 
        onFontSizeChange={setFontSize} 
        currentContent={currentContent} // Pass content state
      /> 
    </div>
  );
};

export default Editor;
