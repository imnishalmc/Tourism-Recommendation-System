import React from "react";
import '@fontsource/plus-jakarta-sans'
import '@fontsource/plus-jakarta-sans/700.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </React.StrictMode>
);