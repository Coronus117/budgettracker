import React from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const buttons = [
  { label: "Budget", to: "/" },
  { label: "Expenses", to: "/expenses" },
];

function Navigation() {
  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2} direction="row">
        {buttons.map((b) => {
          return (
            <nav key={b.label} className="border-2 px-5 py-3 rounded-lg">
              <Link to={`${b.to}`}>
                <Button variant="contained">{b.label}</Button>
              </Link>
            </nav>
          );
        })}
      </Stack>
    </Box>
  );
}

export default Navigation;
