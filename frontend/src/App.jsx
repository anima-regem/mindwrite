import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./pages/Editor";
import About from "./pages/About";

function App() {

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Editor}/>
                <Route path="/about" Component={About} />
            </Routes>
        </BrowserRouter>
    );

}

export default App;
