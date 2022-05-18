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

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#00DB00",
  },
});

function Category({ title, max, curr, editClickHandler, expenses }) {
  return (
    <Paper elevation={3}>
      <Box padding={1}>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h4" component="h2">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={3} display="flex" justifyContent="end">
            <IconButton aria-label="delete" onClick={editClickHandler}>
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid container>
              <Grid item display={"flex"} alignItems={"center"}>
                <StyledRating
                  name="simple-controlled"
                  value={(1 - curr / max) * 5}
                  readOnly
                  precision={0.5}
                  icon={<PaidIcon fontSize="inherit" />}
                  emptyIcon={<PaidIcon fontSize="inherit" />}
                />
              </Grid>
              <Grid item paddingLeft={1}>
                <Typography>{`$${curr} / $${max}`}</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {expenses.map((e) => (
              <Grid container>
                <Grid item xs={8}>
                  {e.title}
                </Grid>
                <Grid item xs={2} textAlign="right" paddingRight={2}>
                  {e.cost}
                </Grid>
                <Grid item xs={2} textAlign={"center"}>
                  {e.date.slice(0, -5)}
                </Grid>
              </Grid>
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
}

export default Category;
