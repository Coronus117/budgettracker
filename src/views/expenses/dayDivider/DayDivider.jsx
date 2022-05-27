import React from "react";
import { Typography } from "@mui/material";

function DayDivider({ cost, dateString }) {
  return (
    <>
      <Typography variant="h5" component="h2" fontWeight={"bold"}>
        {`Total ${dateString}: $${cost}`}
      </Typography>
      <hr />
    </>
  );
}

export default DayDivider;
