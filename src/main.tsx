import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import Providers from "../providers.tsx";
import GlobeComponent from "./components/Globe.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <GlobeComponent />
    </Providers>
  </StrictMode>
);
