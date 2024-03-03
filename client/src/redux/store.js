import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reducer from "./reducers"; // Import your user reducer here

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  reducer, // Add more reducers here if needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Optionally, you can provide middleware, devtools configuration, etc.
});

const persistor = persistStore(store);

export { store, persistor };
