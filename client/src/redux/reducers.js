import { createReducer } from "@reduxjs/toolkit";
import { SET_SELECTED_PRODUCT_ID, SET_USER_ID } from "./actions";

const initialState = {
  selectedProductId: null,
  UserId: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(SET_SELECTED_PRODUCT_ID, (state, action) => {
      console.log(
        "SET_SELECTED_PRODUCT_ID action dispatched. Payload:",
        action.payload
      );
      state.selectedProductId = action.payload;
    })
    .addCase(SET_USER_ID, (state, action) => {
      console.log("SET_USER_ID action dispatched. Payload:", action.payload);
      state.UserId = action.payload;
    });
});

export default reducer;
