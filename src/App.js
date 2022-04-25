import React from "react";
import { Routes, Route } from "react-router-dom";
import Budget from "./views/budget/Budget";
import Expenses from "./views/expenses/Expenses";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Budget />} />
        <Route path="expenses" element={<Expenses />} />
      </Routes>
    </div>
  );
}

export default App;
