import React from "react";
import { Routes, Route } from "react-router-dom";
import Budget from "./views/budget/Budget";
import Expenses from "./views/expenses/Expenses";
import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function App() {
  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Routes>
          <Route path="/" element={<Budget />} />
          <Route path="expenses" element={<Expenses />} />
        </Routes>
      </LocalizationProvider>
    </Container>
  );
}

export default App;
