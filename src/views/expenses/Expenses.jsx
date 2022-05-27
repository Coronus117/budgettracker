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

import { useSelector } from "react-redux";

import DayDivider from "./dayDivider/DayDivider";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const week = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

function Expenses() {
  const currDate = useSelector((state) => state.currDate);
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
  } = useSWR(
    `${httpBasePath}/categories/${currDate.getFullYear()}/${currDate.getMonth()}.json`,
    fetcher
  );

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

  let dayDivider_date = new Date("1900/1/1").toDateString();
  let dayDivider_totalCost = 0;
  let dayDivider_render = false;
  const calcDayDivider = (date, cost, date2) => {
    const currDate = new Date(date).toDateString();
    const nextDate = new Date(date2).toDateString();

    if (currDate !== dayDivider_date) {
      dayDivider_totalCost = cost;
      dayDivider_date = currDate;
    } else {
      dayDivider_totalCost += cost;
    }

    if (currDate !== nextDate) {
      dayDivider_render = true;
    } else {
      dayDivider_render = false;
    }
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
              formattedExpenseData
                .filter((data) => {
                  return new Date(data.date).getMonth() === currDate.getMonth();
                })
                .sort((obj1, obj2) => new Date(obj2.date) - new Date(obj1.date))
                .map((expense, i, elements) => (
                  <>
                    <Expense
                      key={i}
                      expenseData={expense}
                      editClickHandler={() => {
                        setSelectedExpenseData(expense);
                        clickOpenExpenseModalHandler("edit");
                      }}
                    />
                    {calcDayDivider(
                      expense.date,
                      expense.cost,
                      elements[i + 1]?.date
                    )}
                    {dayDivider_render && (
                      <DayDivider
                        cost={dayDivider_totalCost}
                        dateString={`${expense.date.slice(0, -5)} - ${
                          week[new Date(expense.date).getDay()]
                        }`}
                      />
                    )}
                  </>
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
