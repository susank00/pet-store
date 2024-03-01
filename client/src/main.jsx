import React from "react";
import { createRoot } from "react-dom"; // Import createRoot from react-dom
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

// Use createRoot to render the app
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
