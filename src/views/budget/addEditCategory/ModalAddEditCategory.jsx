import React, { useState } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";

import { httpClient } from "helpers";

// const categorySchema = Yup.object().shape({
//   categoryName: Yup.string()
//     .max(250, "Sorry that name is too long")
//     .required("This field is required"),
//   categoryMaxBudget: Yup.number()
//     .min(0, "Enter a valid number")
//     .required("This field is required"),
// });

const initialValues = Object.freeze({
  categoryName: "",
  categoryMaxBudget: 0,
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

  const clickDeleteHandler = async () => {
    setState({ ...state, isLoading: true });

    const { status } = await httpClient.delete(
      `/categories/${editCatData.id}.json`
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

    try {
      let res;
      if (type === "add") {
        res = await httpClient.post("/categories.json", values);
      } else {
        res = await httpClient.put(
          `/categories/${editCatData.id}.json`,
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
      initVals.categoryName = editCatData.categoryName;
      initVals.categoryMaxBudget = editCatData.categoryMaxBudget;
    }

    return initVals;
  };

  return (
    <div>Modal</div>
    // <Modal
    //   className="modal-content"
    //   open={catModalOpen}
    //   requestClose={handleClose}
    // >
    //   <Formik
    //     initialValues={getInitialValues(type)}
    //     validationSchema={categorySchema}
    //     onSubmit={handleSubmit}
    //   >
    //     {({ isValid, isSubmitting, dirty, setErrors }) => (
    //       <Form className="modal-content">
    //         {!state.isComplete && !state.isLoading && (
    //           <Modal.Header className="bg-gray-100">
    //             <h4 className="text-xl font-bold lg:text-2xl">
    //               {type === "add" ? "Add Category" : "Edit Category"}
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
    //                     <InputField name="categoryName" label="Category Name" />
    //                     <div className="flex w-1/2">
    //                       <InputField
    //                         type="number"
    //                         name="categoryMaxBudget"
    //                         label="Max Monthly Budget"
    //                       />
    //                     </div>
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

export default ModalAddEditCategory;
