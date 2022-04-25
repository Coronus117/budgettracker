import React, { useState, useEffect } from "react";
import useSWR from "swr";

import { httpBasePath } from "helpers";
import fetchOnce from "helpers";
import Layout from "views/shared/layout";
import Expense from "./expense/Expense";
import ModalAddEditExpense from "./addEditExpense/ModalAddEditExpense";

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
  } = useSWR(`${httpBasePath}/categories.json`, fetchOnce);

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
  } = useSWR(`${httpBasePath}/expenses.json`, fetchOnce);
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
      <Layout>
        {expenseIsValidating && <div>LOADING LOADING LOADING</div>}

        <div className="flex flex-col gap-2 mx-6">
          {expenseData &&
            !expenseError &&
            formattedExpenseData &&
            formattedExpenseData.map((expense) => (
              <Expense
                expenseData={expense}
                editClickHandler={() => {
                  setSelectedExpenseData(expense);
                  clickOpenExpenseModalHandler("edit");
                }}
              />
            ))}
          <button
            onClick={() => clickOpenExpenseModalHandler("add")}
            className="w-20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z" />
            </svg>
          </button>
        </div>

        {expenseError && <div>ERROR ERROR ERROR</div>}
      </Layout>
      <ModalAddEditExpense
        expenseModalOpen={expenseModalOpen.open}
        requestClose={() => setExpenseModalOpen({ open: false, type: "add" })}
        type={expenseModalOpen.type}
        editExpenseData={selectedExpenseData}
        mutate={expenseMutate}
        categories={formattedCategoryData?.map((c) => c.categoryName)}
      />
    </div>
  );
}

export default Expenses;
