import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Pioche from "./components/pioche.tsx";
import Frise from "./components/Frise.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Frise></Frise>
    <Pioche />
  </StrictMode>
);
