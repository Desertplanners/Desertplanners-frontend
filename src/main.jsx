import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import RemoveTrailingSlash from "./components/RemoveTrailingSlash.jsx";   // ⭐ Import here

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <RemoveTrailingSlash />   {/* ⭐ MUST be here */}
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
