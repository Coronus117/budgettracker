import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import amazonPNG from "public/amazon.png";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

const week = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

function Expense({ expenseData, editClickHandler }) {
  const { title, cost, category, date, amazon, cash } = expenseData;
  return (
    <Paper elevation={3}>
      <Box padding={1}>
        <Grid container>
          <Grid item xs={10} sm={3} md={3} display="flex" alignItems="center">
            <Typography
              variant="h5"
              component="h2"
              overflow="hidden"
              textOverflow={"ellipsis"}
            >
              {title}
            </Typography>
          </Grid>
          <Grid
            variant="h5"
            component="h2"
            item
            xs={2}
            sm={2}
            md={2}
            display="flex"
            alignItems="center"
            sx={{
              justifyContent: { xs: "end", sm: "start" },
              paddingRight: { xs: 1, sm: 0 },
            }}
          >
            {`$${cost}`}
          </Grid>
          <Grid item xs={12} sm={7} md={7}>
            {/* <Typography> */}
            <Grid container>
              <Grid item xs={4} display="flex" alignItems="center">
                {category}
              </Grid>
              <Grid item xs={4} display="flex" alignItems="center">
                {`${date.slice(0, -5)} - ${week[new Date(date).getDay()]}`}
              </Grid>
              <Grid item xs={2} display="flex" alignItems="center">
                <Stack
                  direction="row"
                  spacing={2}
                  display="flex"
                  alignItems="center"
                >
                  {amazon && (
                    <img src={amazonPNG} className="amazonLogo-expense" />
                  )}
                  {cash && <LocalAtmIcon />}
                </Stack>
              </Grid>
              <Grid item xs={2} display="flex" justifyContent="end">
                <IconButton aria-label="delete" onClick={editClickHandler}>
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
            {/* </Typography> */}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default Expense;
