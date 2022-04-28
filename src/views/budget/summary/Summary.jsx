import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Rating from "@mui/material/Rating";
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

import PaidIcon from "@mui/icons-material/Paid";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#00DB00",
  },
});

function Summary({ max, curr }) {
  return (
    <Paper elevation={5} sx={{ backgroundColor: "#F3F3F3" }}>
      <Box padding={1}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2">
              Summary
            </Typography>
          </Grid>
          <Grid item>
            <StyledRating
              name="simple-controlled"
              value={(1 - curr / max) * 10}
              readOnly
              precision={0.5}
              icon={<PaidIcon fontSize="inherit" />}
              emptyIcon={<PaidIcon fontSize="inherit" />}
              max={10}
            />
          </Grid>
          <Grid item paddingLeft={1}>
            <Typography>{`$${curr} / $${max}`}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default Summary;
