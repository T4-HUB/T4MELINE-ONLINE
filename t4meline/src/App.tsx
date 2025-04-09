import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Acceuil from "./components/acceuil";
import Partie from "./components/partie";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/partie" element={<Partie />} />
      </Routes>
    </Router>
  );
}

export default App;