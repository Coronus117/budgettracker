import { createStore } from "redux";
import addMonths from "date-fns/addMonths";

const initialDate = () => {
  let firstofthemonth = new Date();
  firstofthemonth.setDate(1);
  return firstofthemonth;
};

const counterReducer = (state = { currDate: initialDate() }, action) => {
  if (action.type === "increment") {
    return { currDate: addMonths(state.currDate, 1) };
  }

  if (action.type === "decrement") {
    return { currDate: addMonths(state.currDate, -1) };
  }

  return state;
};

const store = createStore(counterReducer);

export default store;
