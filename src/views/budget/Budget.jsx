import React, { useState, useEffect } from "react";
import useSWR from "swr";

import { httpBasePath } from "helpers";
import Layout from "views/shared/layout";
import Category from "./category/Category";
import ModalAddEditCategory from "./addEditCategory/ModalAddEditCategory";

import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

import { useSelector } from "react-redux";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Budget() {
  const currDate = useSelector((state) => state.currDate);

  const [catModalOpen, setCatModalOpen] = useState({
    open: false,
    type: "add",
  });
  const [formattedCategoryData, setFormattedCategoryData] = useState(null);
  const [finalCategoryData, setFinalCategoryData] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [formattedExpenseData, setFormattedExpenseData] = useState(null);

  const {
    data: catData,
    error: catError,
    isValidating: catIsValidating,
    mutate: catMutate,
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

  const CalcUsedBudget = () => {
    if (
      formattedCategoryData &&
      formattedCategoryData.length > 0 &&
      formattedExpenseData &&
      formattedExpenseData.length > 0
    ) {
      const updatedCategoryData = [...formattedCategoryData];
      updatedCategoryData.map((cat) => {
        cat.currentlyUsedBudget = 0;
        return formattedExpenseData.map((exp) => {
          if (exp.category === cat.name) {
            const expDate = new Date(exp.date);
            if (expDate.getMonth() === currDate.getMonth()) {
              cat.currentlyUsedBudget += exp.cost;
            }
          }
          return cat;
        });
      });
      setFinalCategoryData(updatedCategoryData);
    }
  };

  useEffect(() => {
    CalcUsedBudget();
  }, [formattedCategoryData, formattedExpenseData, currDate]);

  const {
    data: expenseData,
    // error: expenseError,
    // isValidating: expenseIsValidating,
    // mutate: expenseMutate,
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

  const clickOpenCatModalHandler = (type) => {
    setCatModalOpen({ open: true, type: type });
  };

  return (
    <div>
      <Layout clickAddHandler={() => clickOpenCatModalHandler("add")}>
        {catIsValidating && <div>LOADING LOADING LOADING</div>}
        <Stack gap={2}>
          {catData && !catError && finalCategoryData && (
            <Grid container spacing={2}>
              {finalCategoryData.map((cat, i) => (
                <Grid item key={i} xs={12} sm={6} md={4}>
                  <Category
                    title={cat.name}
                    max={cat.maxBudget}
                    curr={cat.currentlyUsedBudget}
                    editClickHandler={() => {
                      setSelectedCategoryData(cat);
                      clickOpenCatModalHandler("edit");
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
        {catError && <div>ERROR ERROR ERROR</div>}
      </Layout>
      <ModalAddEditCategory
        catModalOpen={catModalOpen.open}
        requestClose={() => setCatModalOpen({ open: false, type: "add" })}
        type={catModalOpen.type}
        editCatData={selectedCategoryData}
        mutate={catMutate}
      />
    </div>
  );
}

export default Budget;
