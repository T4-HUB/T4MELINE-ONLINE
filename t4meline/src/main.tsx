import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
<<<<<<< HEAD
import "./index.css";
import App from "./App.tsx";
=======
import App from "./App.tsx";
import Pioche from "./components/pioche.tsx";
import Frise from "./components/frise.tsx";
>>>>>>> oceane2

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
