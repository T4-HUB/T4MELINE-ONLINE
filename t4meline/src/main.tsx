import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Pioche from "./components/pioche.tsx";
import Frise from "./components/frise.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Frise />
    <Pioche />
  </StrictMode>
);
