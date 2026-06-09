import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StorefrontProvider } from "./store/storefront";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StorefrontProvider>
        <App />
      </StorefrontProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
