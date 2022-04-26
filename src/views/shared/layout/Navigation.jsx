import React from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const buttons = [
  { label: "Budget", to: "/" },
  { label: "Expenses", to: "/expenses" },
];

function Navigation({ clickAddHandler }) {
  return (
    <Box sx={{ py: 2 }}>
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
        <IconButton
          aria-label="delete"
          onClick={clickAddHandler}
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default Navigation;
