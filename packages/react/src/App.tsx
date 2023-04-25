import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Import Home component
import AddBook from "./components/AddBook"; // Import AddBook component
import About from "./components/About"; // Import About component

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/about/:id" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
