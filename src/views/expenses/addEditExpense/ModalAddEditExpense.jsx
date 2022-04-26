import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { httpClient } from "helpers";

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
  date: new Date().toLocaleDateString(),
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
        }, 4500);
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
        }, 4500);
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
                  <TextField
                    required={true}
                    id="category-input"
                    name="category"
                    label="category"
                    type="text"
                    value={values.category}
                    onChange={handleChange}
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required={true}
                    id="date-input"
                    name="date"
                    label="date"
                    type="text"
                    value={values.date}
                    onChange={handleChange}
                    error={touched.date && Boolean(errors.date)}
                    helperText={touched.date && errors.date}
                  />
                </Grid>
              </Grid>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
    // <Modal
    //   className="modal-content"
    //   open={expenseModalOpen}
    //   requestClose={handleClose}
    // >
    //   <Formik
    //     initialValues={getInitialValues(type)}
    //     validationSchema={expenseSchema}
    //     onSubmit={handleSubmit}
    //   >
    //     {({ isValid, isSubmitting, dirty, setErrors }) => (
    //       <Form className="modal-content">
    //         {!state.isComplete && !state.isLoading && (
    //           <Modal.Header className="bg-gray-100">
    //             <h4 className="text-xl font-bold lg:text-2xl">
    //               {type === "add" ? "Add Expense" : "Edit Expense"}
    //             </h4>
    //             <div className="absolute right-0 pr-6">
    //               <button type="button" onClick={handleClose}>
    //                 <svg viewBox="0 0 20 20" className="w-5 h-5">
    //                   <path d="M16.6952 0.51282C17.4549 -0.17094 18.6705 -0.17094 19.4302 0.51282C20.1899 1.27255 20.1899 2.48813 19.4302 3.24786L12.7445 10.0095L19.4302 16.6952C20.1899 17.4549 20.1899 18.6705 19.4302 19.4302C18.6705 20.1899 17.4549 20.1899 16.6952 19.4302L10.0095 12.7445L3.24786 19.4302C2.48813 20.1899 1.27255 20.1899 0.51282 19.4302C-0.17094 18.6705 -0.17094 17.4549 0.51282 16.6952L7.27445 10.0095L0.51282 3.24786C-0.17094 2.48813 -0.17094 1.27255 0.51282 0.51282C1.27255 -0.17094 2.48813 -0.17094 3.24786 0.51282L10.0095 7.27445L16.6952 0.51282Z" />
    //                 </svg>
    //               </button>
    //             </div>
    //           </Modal.Header>
    //         )}
    //         <Modal.Body>
    //           <div>
    //             {!state.isComplete && !state.isLoading && (
    //               <div className="max-w-md px-6 mx-auto">
    //                 <div className="py-12">
    //                   <div className="space-y-6">
    //                     <InputField name="title" label="Expense Title" />
    //                     <div className="flex w-1/2">
    //                       <InputField
    //                         type="number"
    //                         name="cost"
    //                         label="Expense Cost"
    //                       />
    //                     </div>
    //                     <InputField
    //                       type="select"
    //                       name="category"
    //                       label="Expense Category"
    //                       options={categories.map((cat) => ({
    //                         value: cat,
    //                         label: cat,
    //                       }))}
    //                     />
    //                     <InputField
    //                       type="date"
    //                       name="expenseDate"
    //                       label="Expense Date"
    //                     />
    //                   </div>
    //                 </div>
    //               </div>
    //             )}
    //             {state.isLoading && (
    //               <div className="flex justify-center p-20">Sending...</div>
    //             )}
    //             {state.isComplete && (
    //               <div className="flex flex-col p-12">
    //                 <div className="flex justify-end">
    //                   {!state.isLoading && (
    //                     <button type="button" onClick={handleClose}>
    //                       <svg viewBox="0 0 20 20" className="w-5 h-5">
    //                         <path d="M16.6952 0.51282C17.4549 -0.17094 18.6705 -0.17094 19.4302 0.51282C20.1899 1.27255 20.1899 2.48813 19.4302 3.24786L12.7445 10.0095L19.4302 16.6952C20.1899 17.4549 20.1899 18.6705 19.4302 19.4302C18.6705 20.1899 17.4549 20.1899 16.6952 19.4302L10.0095 12.7445L3.24786 19.4302C2.48813 20.1899 1.27255 20.1899 0.51282 19.4302C-0.17094 18.6705 -0.17094 17.4549 0.51282 16.6952L7.27445 10.0095L0.51282 3.24786C-0.17094 2.48813 -0.17094 1.27255 0.51282 0.51282C1.27255 -0.17094 2.48813 -0.17094 3.24786 0.51282L10.0095 7.27445L16.6952 0.51282Z" />
    //                       </svg>
    //                     </button>
    //                   )}
    //                 </div>
    //                 <div className="flex items-center md:space-x-6">
    //                   <div className="hidden w-full md:block">
    //                     {state.isSuccess && <div>CONFIRM IMAGE HERE</div>}
    //                     {state.isError && <div>FALI IMAGE HERE</div>}
    //                   </div>
    //                   {state.isLoading && (
    //                     <div className="flex flex-col items-center justify-center w-full text-primary-light">
    //                       <svg viewBox="0 0 128 128" className="w-24 h-24">
    //                         <g>
    //                           <path
    //                             d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z"
    //                             fill="currentColor"
    //                           />
    //                           LOADING
    //                         </g>
    //                       </svg>
    //                     </div>
    //                   )}
    //                   {state.isComplete && state.isSuccess && (
    //                     <div className="flex flex-col w-full space-y-6">
    //                       <h4 className="font-bold">CONFIRMATION</h4>
    //                       <div className="flex">
    //                         <button onClick={handleClose}>CLOSE BUTTON</button>
    //                       </div>
    //                     </div>
    //                   )}
    //                   {state.isComplete && state.isError && (
    //                     <div className="flex flex-col w-full space-y-6">
    //                       <h4 className="font-bold">Oops!</h4>
    //                       <p className="pt-2">ERROR MESSAGE</p>
    //                       <div className="flex">
    //                         <button onClick={handleClose}>CLOSE BUTTON</button>
    //                       </div>
    //                     </div>
    //                   )}
    //                 </div>
    //               </div>
    //             )}
    //           </div>
    //         </Modal.Body>
    //         {!state.isComplete && !state.isLoading && (
    //           <Modal.Footer>
    //             <div className="max-w-md px-6 mx-auto">
    //               <div className="flex justify-around">
    //                 <button
    //                   type="submit"
    //                   size="md"
    //                   disabled={!(isValid && dirty) || isSubmitting}
    //                   className="border-2 px-4 py-2 rounded-xl"
    //                 >
    //                   SAVE
    //                 </button>
    //                 <button
    //                   type="button"
    //                   onClick={() => clickDeleteHandler()}
    //                   size="md"
    //                   disabled={isSubmitting}
    //                   className="border-2 px-4 py-2 rounded-xl"
    //                 >
    //                   DELETE
    //                 </button>
    //               </div>
    //             </div>
    //           </Modal.Footer>
    //         )}
    //       </Form>
    //     )}
    //   </Formik>
    // </Modal>
  );
}

export default ModalAddEditExpense;
