import React, { useState, useEffect } from "react";
import useSWR from "swr";

import { httpBasePath } from "helpers";
import Layout from "views/shared/layout";
import Category from "./category/Category";
import ModalAddEditCategory from "./addEditCategory/ModalAddEditCategory";

import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";

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
    const updatedCategoryData = formattedCategoryData;
    if (updatedCategoryData && formattedExpenseData) {
      updatedCategoryData.map((cat) => {
        return formattedExpenseData.map((exp) => {
          if (exp.category === cat.name) {
            if (!cat.currentlyUsed) cat.currentlyUsed = 0;
            cat.currentlyUsed += exp.cost;
          }
          return cat;
        });
      });
    }
    console.log("updatedCategoryData", updatedCategoryData);
    // setFormattedCategoryData(updatedCategoryData);
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
          <Box sx={{ p: 4 }}>
            <Stack spacing={2}>
              {formattedCategoryData.map((cat, i) => (
                <Category
                  key={i}
                  title={cat.name}
                  max={cat.maxBudget}
                  curr={cat?.currentlyUsed || "CALCULATE THIS"}
                  editClickHandler={() => {
                    setSelectedCategoryData(cat);
                    clickOpenCatModalHandler("edit");
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
        <button onClick={() => clickOpenCatModalHandler("add")}>
          <Box className="category-add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z" />
            </svg>
          </Box>
        </button>
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
