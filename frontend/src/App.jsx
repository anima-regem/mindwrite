import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResizableBox } from "react-resizable";
import "./App.css";
// Import Editor page component instead of EditorComp directly
import Editor from "./pages/Editor"; 
import About from "./pages/About";
import Sidebar from "./components/Sidebar/Sidebar";
import "react-resizable/css/styles.css";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [selectedEntry, setSelectedEntry] = useState(null); // State for selected entry filename

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleResize = (event, { size }) => {
        setSidebarWidth(size.width);
    };

    // Handler for when an entry is selected in the Sidebar
    const handleEntrySelect = (entryName) => {
        console.log("Selected entry in App:", entryName);
        setSelectedEntry(entryName);
    };

    return (
        <BrowserRouter>
            <div id="app" className="flex h-screen flex-col fade-in-section"> {/* Added fade-in-section class */}
                <button onClick={toggleSidebar} className="absolute top-2 right-2 z-10 p-1 rounded">
                    ☰
                </button>
                <div className="flex flex-1 overflow-hidden">
                    {/* Main Content Area (Moved to the left) */}
                    <div className="flex-1 flex flex-col">
                        <Routes>
                            {/* Render Editor page component and pass selectedEntry */}
                            <Route path="/" element={<Editor selectedEntry={selectedEntry} />} />
                            <Route path="/about" Component={About} />
                        </Routes>
                    </div>
                    {/* Sidebar Area (Moved to the right) */}
                    {isSidebarOpen && (
                        <ResizableBox
                            width={sidebarWidth}
                            height={Infinity}
                            axis="x"
                            minConstraints={[150, Infinity]}
                            maxConstraints={[500, Infinity]}
                            onResize={handleResize}
                            resizeHandles={["w"]} // Changed handle to west
                            className="relative overflow-y-auto border-l border-gray-300" // Changed border-r to border-l
                        >
                            {/* Pass the handler to Sidebar */}
                            <Sidebar onEntrySelect={handleEntrySelect} />
                        </ResizableBox>
                    )}
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
