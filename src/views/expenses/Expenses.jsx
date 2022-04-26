import React, { useState, useEffect } from "react";
import useSWR from "swr";

import { httpBasePath } from "helpers";
import Layout from "views/shared/layout";
import Expense from "./expense/Expense";
import ModalAddEditExpense from "./addEditExpense/ModalAddEditExpense";

import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Expenses() {
  const [expenseModalOpen, setExpenseModalOpen] = useState({
    open: false,
    type: "add",
  });
  const [formattedExpenseData, setFormattedExpenseData] = useState(null);
  const [selectedExpenseData, setSelectedExpenseData] = useState(null);

  const [formattedCategoryData, setFormattedCategoryData] = useState(null);
  const {
    data: catData,
    // error: catError,
    // isValidating: catIsValidating,
    // mutate: catMutate,
  } = useSWR(`${httpBasePath}/categories.json`, fetcher);

  useEffect(() => {
    const transformedCatData = [];
    for (const key in catData) {
      const catObj = {
        id: key,
        ...catData[key],
      };
      transformedCatData.push(catObj);
    }
    setFormattedCategoryData(transformedCatData);
  }, [catData]);

  const {
    data: expenseData,
    error: expenseError,
    isValidating: expenseIsValidating,
    mutate: expenseMutate,
  } = useSWR(`${httpBasePath}/expenses.json`, fetcher);
  useEffect(() => {
    const transformedExpenseData = [];
    for (const key in expenseData) {
      const expenseObj = {
        id: key,
        ...expenseData[key],
      };
      transformedExpenseData.push(expenseObj);
    }
    setFormattedExpenseData(transformedExpenseData);
  }, [expenseData]);

  const clickOpenExpenseModalHandler = (type) => {
    setExpenseModalOpen({ open: true, type: type });
  };

  return (
    <div>
      <Layout clickAddHandler={() => clickOpenExpenseModalHandler("add")}>
        {expenseIsValidating && <div>LOADING LOADING LOADING</div>}

        <Box>
          <Stack spacing={2}>
            {expenseData &&
              !expenseError &&
              formattedExpenseData &&
              formattedExpenseData.map((expense, i) => (
                <Expense
                  key={i}
                  expenseData={expense}
                  editClickHandler={() => {
                    setSelectedExpenseData(expense);
                    clickOpenExpenseModalHandler("edit");
                  }}
                />
              ))}
          </Stack>
        </Box>

        {expenseError && <div>ERROR ERROR ERROR</div>}
      </Layout>
      <ModalAddEditExpense
        expenseModalOpen={expenseModalOpen.open}
        requestClose={() => setExpenseModalOpen({ open: false, type: "add" })}
        type={expenseModalOpen.type}
        editExpenseData={selectedExpenseData}
        mutate={expenseMutate}
        categories={formattedCategoryData?.map((c) => c.name)}
      />
    </div>
  );
}

export default Expenses;
