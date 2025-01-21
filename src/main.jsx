import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ThemeAuth from "./context/ThemeAuth.jsx";
import LogAuth from "./context/LogAuth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LogAuth>
      <ThemeAuth>
        <BrowserRouter>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </ThemeAuth>
    </LogAuth>
  </StrictMode>
);
