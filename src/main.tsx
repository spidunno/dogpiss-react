import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import '@fontsource/inter/index.css';
import { CssBaseline, CssVarsProvider } from "@mui/joy";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
    <CssVarsProvider>
      <CssBaseline/>
		  <App />
    </CssVarsProvider>
	</StrictMode>
);
