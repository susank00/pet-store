const initialState = {
  userSession: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_SESSION":
      return {
        ...state,
        userSession: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
