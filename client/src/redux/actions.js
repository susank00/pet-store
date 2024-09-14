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
export const SET_SELECTED_EMPLOYEES_ID = "SET_EMPLOYEES_PRODUCT_ID";
export const setSelectedEmployeesId = (employeesId) => ({
  type: SET_SELECTED_EMPLOYEES_ID,
  payload: employeesId,
});
