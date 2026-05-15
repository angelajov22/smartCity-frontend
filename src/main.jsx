import React, { StrictMode } from "react";
import ReactDOM, { createRoot } from "react-dom/client";

import "leaflet/dist/leaflet.css";
import "./index.css";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
