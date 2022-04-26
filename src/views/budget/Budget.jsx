import React, { useState, useEffect } from "react";
import useSWR from "swr";

import { httpBasePath } from "helpers";
import Layout from "views/shared/layout";
import Category from "./category/Category";
import ModalAddEditCategory from "./addEditCategory/ModalAddEditCategory";

import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Budget() {
  const [catModalOpen, setCatModalOpen] = useState({
    open: false,
    type: "add",
  });
  const [formattedCategoryData, setFormattedCategoryData] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);

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

  const [formattedExpenseData, setFormattedExpenseData] = useState(null);

  useEffect(() => {
    if (formattedCategoryData && formattedExpenseData) {
      const updatedCategoryData = formattedCategoryData;
      updatedCategoryData.map((cat) => {
        return formattedExpenseData.map((exp) => {
          if (exp.category === cat.name) {
            if (!cat.currentlyUsedBudget) cat.currentlyUsedBudget = 0;
            cat.currentlyUsedBudget += exp.cost;
          }
          return cat;
        });
      });
      setFormattedCategoryData(updatedCategoryData);
    }
  }, [formattedCategoryData, formattedExpenseData]);

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
      <Layout>
        {catIsValidating && <div>LOADING LOADING LOADING</div>}
        {catData && !catError && formattedCategoryData && (
          <Grid container sx={{ p: 4 }} spacing={4}>
            {formattedCategoryData.map((cat, i) => (
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
        <IconButton
          aria-label="delete"
          onClick={() => clickOpenCatModalHandler("add")}
        >
          <AddCircleOutlineIcon />
        </IconButton>
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
