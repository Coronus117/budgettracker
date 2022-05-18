import React, { useState } from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Grid } from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

const buttons = [
  { label: "Budget", to: "/" },
  { label: "Expenses", to: "/expenses" },
];

function Navigation({ clickAddHandler }) {
  const dispatch = useDispatch();
  const currDate = useSelector((state) => state.currDate);

  const clickDateHandler = (dir) => {
    switch (dir) {
      case "left":
        dispatch({ type: "decrement" });
        break;
      default:
        dispatch({ type: "increment" });
    }
  };

  const MonthName = () => {
    const date = new Date(currDate);
    return date.toLocaleString("default", { month: "long" });
  };

  return (
    <Box display="flex" justifyContent="space-between" paddingY={2}>
      <Grid container>
        <Grid item xs={6} sm={4} display="flex" justifyContent="start">
          <Stack spacing={2} direction="row" display="flex" alignItems="center">
            {buttons.map((b) => {
              return (
                <Box key={b.label} display="flex" alignItems="center">
                  <Link to={`${b.to}`}>
                    <Button variant="contained">{b.label}</Button>
                  </Link>
                </Box>
              );
            })}
          </Stack>
        </Grid>
        <Grid item xs={6} sm={4} display="flex" justifyContent="end">
          <Stack
            spacing={0}
            direction="row"
            display="flex"
            alignItems="center"
            sx={{
              justifyContent: { xs: "start", sm: "end" },
            }}
          >
            <IconButton
              aria-label="delete"
              onClick={() => clickDateHandler("left")}
            >
              <ChevronLeftIcon
                sx={{ width: { xs: 24, sm: 30 }, height: "auto" }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: { xs: 14, sm: 20 },
                fontWeight: { xs: 500, sm: 500 },
              }}
              component="h4"
            >
              {`${MonthName()}`}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 14, sm: 20 },
                fontWeight: { xs: 500, sm: 500 },
              }}
              component="h4"
              paddingLeft={1}
            >
              {`'${currDate.getFullYear().toString().substring(2)}`}
            </Typography>
            <IconButton
              aria-label="delete"
              onClick={() => clickDateHandler("right")}
              sx={{ display: "flex", justifyContent: "end" }}
            >
              <ChevronRightIcon
                sx={{ width: { xs: 24, sm: 30 }, height: "auto" }}
              />
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} display="flex" justifyContent="end">
          <IconButton
            aria-label="delete"
            onClick={clickAddHandler}
            sx={{ display: "flex", justifyContent: "end" }}
          >
            <AddCircleOutlineIcon
              sx={{ width: { xs: 24, sm: 28 }, height: "auto" }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Navigation;
