import React, { useState, useEffect } from "react";
import useSWR from "swr";

import { httpBasePath } from "helpers";
import Layout from "views/shared/layout";
import Category from "./category/Category";
import ModalAddEditCategory from "./addEditCategory/ModalAddEditCategory";
import Summary from "./summary/Summary";

import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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
  const [summary, setSummary] = useState({
    totalBudget: 0,
    totalUsedBudget: 0,
  });

  const sortOptions = ["% Used", "$ Used", "$ Budget", "ABC"];
  const [sortOption, setSortOption] = useState(sortOptions[0]);

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
      let totalBudget = 0;
      let totalUsedBudget = 0;
      const updatedCategoryData = [...formattedCategoryData];
      updatedCategoryData.map((cat) => {
        totalBudget += cat.maxBudget;
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

      formattedExpenseData.map((exp) => {
        const expDate = new Date(exp.date);
        if (expDate.getMonth() === currDate.getMonth()) {
          totalUsedBudget += exp.cost;
        }
      });

      setSummary({
        totalBudget: totalBudget,
        totalUsedBudget: totalUsedBudget,
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
      const expDate = new Date(expenseObj.date);
      if (expDate.getMonth() === currDate.getMonth()) {
        transformedExpenseData.push(expenseObj);
      }
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
          <div className="sortSelect">
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small">Sort</InputLabel>
              <Select
                autoWidth
                labelId="demo-select-small"
                id="demo-select-small"
                value={sortOption}
                label="Age"
                onChange={(e) => setSortOption(e.target.value)}
              >
                {sortOptions.map((option) => {
                  return (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <Summary max={summary.totalBudget} curr={summary.totalUsedBudget} />
          {catData && !catError && finalCategoryData && (
            <Grid container spacing={2}>
              {finalCategoryData
                .sort((obj1, obj2) => {
                  switch (sortOption) {
                    case "% Used":
                      return (
                        obj2.currentlyUsedBudget / obj2.maxBudget -
                        obj1.currentlyUsedBudget / obj1.maxBudget
                      );
                    case "$ Used":
                      return (
                        obj2.currentlyUsedBudget - obj1.currentlyUsedBudget
                      );
                    case "ABC":
                      return obj1.name.localeCompare(obj2.name);
                    // case "$ Budget":
                    default:
                      return obj2.maxBudget - obj1.maxBudget;
                  }
                })
                .map((cat, i) => (
                  <Grid item key={i} xs={12} sm={6} md={4}>
                    <Category
                      title={cat.name}
                      max={cat.maxBudget}
                      curr={cat.currentlyUsedBudget}
                      editClickHandler={() => {
                        setSelectedCategoryData(cat);
                        clickOpenCatModalHandler("edit");
                      }}
                      expenses={formattedExpenseData
                        .filter((e) => {
                          return e.category === cat.name;
                        })
                        .sort(
                          (obj1, obj2) =>
                            new Date(obj2.date) - new Date(obj1.date)
                        )}
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
