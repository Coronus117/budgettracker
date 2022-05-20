import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { DatePicker } from "@mui/x-date-pickers";
import Alert from "@mui/material/Alert";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { httpClient } from "helpers";
import Stack from "@mui/material/Stack";

const expenseSchema = Yup.object().shape({
  title: Yup.string()
    .max(250, "Sorry that name is too long")
    .required("This field is required"),
  cost: Yup.number()
    .min(0, "Enter a valid number")
    .required("This field is required"),
  category: Yup.string()
    .max(250, "Sorry that name is too long")
    .required("This field is required"),
  date: Yup.string()
    .max(250, "Sorry that name is too long")
    .required("This field is required"),
});

const initialValues = Object.freeze({
  title: "",
  cost: 0,
  category: "",
  date: new Date(),
  amazon: false,
  cash: false,
});

function ModalAddEditExpense({
  expenseModalOpen,
  requestClose,
  type,
  editExpenseData,
  mutate,
  categories,
}) {
  const handleSubmit = (values, actions) => {
    values.date = new Date(values.date).toLocaleDateString();
    handleSubmitRequest(values);
    actions.setTouched({});
    actions.setSubmitting(false);
  };

  const [state, setState] = useState({
    isLoading: false,
    isComplete: false,
    isSuccess: false,
    isError: false,
  });

  const clickDeleteHandler = async () => {
    setState({ ...state, isLoading: true });

    const { status } = await httpClient.delete(
      `/expenses/${editExpenseData.id}.json`
    );

    try {
      if (status === 200) {
        mutate();
        setState({
          isLoading: false,
          isComplete: true,
          isError: false,
          isSuccess: true,
        });
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        throw Error("Expense deletion failed.");
      }
    } catch (error) {
      setState({
        isLoading: false,
        isComplete: true,
        isError: true,
        isSuccess: false,
      });
    }
  };

  const handleSubmitRequest = async (values) => {
    setState({ ...state, isLoading: true });

    try {
      let res;
      if (type === "add") {
        res = await httpClient.post("/expenses.json", values);
      } else {
        res = await httpClient.put(
          `/expenses/${editExpenseData.id}.json`,
          values
        );
      }

      const { status } = res;

      if (status === 200) {
        mutate();
        setState({
          isLoading: false,
          isComplete: true,
          isError: false,
          isSuccess: true,
        });
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        throw Error("Expense creation failed.");
      }
    } catch (error) {
      setState({
        isLoading: false,
        isComplete: true,
        isError: true,
        isSuccess: false,
      });
    }
  };

  const handleClose = () => {
    setState({
      isLoading: false,
      isComplete: false,
      isSuccess: false,
      isError: false,
    });
    requestClose();
  };

  const getInitialValues = (modalType) => {
    const initVals = { ...initialValues };
    if (modalType === "edit") {
      initVals.title = editExpenseData.title;
      initVals.cost = editExpenseData.cost;
      initVals.category = editExpenseData.category;
      initVals.date = editExpenseData.date;
      initVals.amazon = editExpenseData.amazon;
      initVals.cash = editExpenseData.cash;
    }

    return initVals;
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={expenseModalOpen}
      onClose={requestClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {state.isLoading && <Alert severity="warning">Sending Data</Alert>}
        {!state.isLoading && state.isSuccess && (
          <Alert severity="success">Success</Alert>
        )}
        {!state.isLoading && state.isError && (
          <Alert severity="error">Error</Alert>
        )}
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          {type === "add" ? "Add Expense" : "Edit Expense"}
        </Typography>
        <Formik
          initialValues={getInitialValues(type)}
          validationSchema={expenseSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid,
            isSubmitting,
            dirty,
            setErrors,
            values,
            touched,
            errors,
            handleChange,
            setFieldValue,
          }) => (
            <Form className="modal-content">
              <Grid
                container
                alignItems="center"
                justify="center"
                direction="column"
                gap={3}
                padding={4}
              >
                <Grid item>
                  <TextField
                    required={true}
                    id="title-input"
                    name="title"
                    label="Title"
                    type="text"
                    value={values.title}
                    onChange={handleChange}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required={true}
                    id="cost-input"
                    name="cost"
                    label="Cost"
                    type="number"
                    value={values.cost}
                    onChange={handleChange}
                    error={touched.cost && Boolean(errors.cost)}
                    helperText={touched.cost && errors.cost}
                  />
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Amazon"
                        name="amazon"
                        onChange={(e) =>
                          setFieldValue("amazon", e.target.checked)
                        }
                        checked={values.amazon}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Cash"
                        name="cash"
                        onChange={(e) =>
                          setFieldValue("cash", e.target.checked)
                        }
                        checked={values.cash}
                      />
                    </FormGroup>
                  </Stack>
                </Grid>
                <Grid item>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Category
                      </InputLabel>
                      <Select
                        required={true}
                        name="category"
                        labelId="demo-simple-select-label"
                        id="category-input"
                        value={values.category}
                        label="Category"
                        onChange={handleChange}
                        error={touched.category && Boolean(errors.category)}
                      >
                        {categories.map((cat, i) => (
                          <MenuItem key={i} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {touched.category && errors.category}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item>
                  {/* <TextField
                    required={true}
                    id="date-input"
                    name="date"
                    label="Date"
                    type="text"
                    value={values.date}
                    onChange={handleChange}
                    error={touched.date && Boolean(errors.date)}
                    helperText={touched.date && errors.date}
                  /> */}
                  {/* <DatePicker
                    id="date-input"
                    name="date"
                    label="Date"
                    value={values.date}
                    onChange={handleChange}
                    renderInput={(params) => {
                      console.log("params", params);
                      return <TextField {...params} />;
                    }}
                  /> */}
                  <DatePicker
                    id="date-input"
                    name="date"
                    label="Date"
                    value={values.date}
                    onChange={(value) => {
                      setFieldValue("date", Date.parse(value));
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button color="primary" variant="contained" type="submit">
                    Submit
                  </Button>
                  {type === "edit" && (
                    <Button
                      type="button"
                      onClick={() => clickDeleteHandler()}
                      color="primary"
                    >
                      DELETE
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

export default ModalAddEditExpense;
