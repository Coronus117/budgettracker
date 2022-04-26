import React from "react";
import { Routes, Route } from "react-router-dom";
import Budget from "./views/budget/Budget";
import Expenses from "./views/expenses/Expenses";
import { Container } from "@mui/material";

function App() {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<Budget />} />
        <Route path="expenses" element={<Expenses />} />
      </Routes>
    </Container>
  );
}

export default App;
