import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./store/auth";
import { StorefrontProvider } from "./store/storefront";
import "./index.css";

// Don't let the browser restore the previous scroll position on refresh / back-forward.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // let in-page anchors (#categories etc.) do their thing
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash]);
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
