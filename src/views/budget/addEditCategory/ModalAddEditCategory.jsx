import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import { httpClient } from "helpers";

import { useSelector } from "react-redux";

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .max(250, "Sorry that name is too long")
    .required("This field is required"),
  maxBudget: Yup.number()
    .min(0, "Enter a valid number")
    .required("This field is required"),
});

const initialValues = Object.freeze({
  name: "",
  maxBudget: 0,
  currentlyUsedBudget: 0,
});

function ModalAddEditCategory({
  catModalOpen,
  requestClose,
  type,
  editCatData,
  mutate,
}) {
  const handleSubmit = (values, actions) => {
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

  const currDate = useSelector((state) => state.currDate);

  const clickDeleteHandler = async () => {
    setState({ ...state, isLoading: true });

    const { status } = await httpClient.delete(
      `/categories/${currDate.getFullYear()}/${currDate.getMonth()}/${
        editCatData.id
      }.json`
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
        throw Error("Category deletion failed.");
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

    values.name = values.name.trimEnd();

    try {
      let res;
      if (type === "add") {
        res = await httpClient.post(
          `/categories/${currDate.getFullYear()}/${currDate.getMonth()}.json`,
          values
        );
      } else {
        res = await httpClient.put(
          `/categories/${currDate.getFullYear()}/${currDate.getMonth()}/${
            editCatData.id
          }.json`,
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
        throw Error("Category creation failed.");
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
      initVals.name = editCatData.name;
      initVals.maxBudget = editCatData.maxBudget;
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
      open={catModalOpen}
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
          {type === "add" ? "Add Category" : "Edit Category"}
        </Typography>
        <Formik
          initialValues={getInitialValues(type)}
          validationSchema={categorySchema}
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
          }) => (
            <Form className="modal-content">
              <Grid
                container
                alignItems="center"
                justify="center"
                direction="column"
                gap={4}
                padding={4}
              >
                <Grid item>
                  <TextField
                    required={true}
                    id="name-input"
                    name="name"
                    label="Name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required={true}
                    id="maxBudget-input"
                    name="maxBudget"
                    label="Max Monthly Budget"
                    type="number"
                    value={values.maxBudget}
                    onChange={handleChange}
                    error={touched.maxBudget && Boolean(errors.maxBudget)}
                    helperText={touched.maxBudget && errors.maxBudget}
                  />
                </Grid>
                <Stack spacing={2} direction="row" justifyContent="center">
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    Submit
                  </Button>
                  {type === "edit" && (
                    <Button
                      type="button"
                      onClick={() => clickDeleteHandler()}
                      disabled={isSubmitting}
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

export default ModalAddEditCategory;
