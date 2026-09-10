import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./store/auth";
import { StorefrontProvider } from "./store/storefront";
import "./index.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StorefrontProvider>
          <ScrollToTop />
          <App />
        </StorefrontProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
