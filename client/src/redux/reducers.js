// reducer.js
import { SET_SELECTED_PRODUCT_ID } from "./actions";

const initialState = {
  selectedProductId: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_PRODUCT_ID:
      console.log(
        "SET_SELECTED_PRODUCT_ID action dispatched. Payload:",
        action.payload
      );
      return {
        ...state,
        selectedProductId: action.payload,
      };
    default:
      console.log("Unrecognized action type:", action.type);
      return state;
  }
};

export default reducer;
