import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "./reducers/"; // Import your user reducer here

// Combine reducers if you have multiple reducers
const rootReducer = combineReducers({
  user: userReducer, // Add more reducers here if needed
});

// Create the Redux store with the combined reducers
const store = configureStore({
  reducer: rootReducer, // Pass the combined reducers object
});

export default store;
