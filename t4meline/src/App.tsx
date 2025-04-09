import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Pioche from "./components/pioche.tsx";
import Frise from "./components/frise.tsx";

function App() {
  const [dataFromPioche, setDataFromPioche] = useState(null);

  return (
    <>
      <Frise data={dataFromPioche} />
      <Pioche onCardSelected={setDataFromPioche} />
    </>
  );
}

export default App;
