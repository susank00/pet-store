// export const setUserSession = (userData) => ({
//   type: "SET_USER_SESSION",
//   payload: userData,
// });

export const SET_USER_ID = "SET_USER_ID";
export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});

export const SET_SELECTED_PRODUCT_ID = "SET_SELECTED_PRODUCT_ID";
export const setSelectedProductId = (productId) => ({
  type: SET_SELECTED_PRODUCT_ID,
  payload: productId,
});
