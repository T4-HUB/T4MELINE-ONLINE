import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Frise from "./components/frise.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Frise></Frise>
  </StrictMode>
);
