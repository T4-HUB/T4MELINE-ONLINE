import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Acceuil from "./components/acceuil";
import Partie from "./components/partie";
import EndGame from "./components/endgame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/partie" element={<Partie />} />
        <Route path="/endgame" element={<EndGame />} />
      </Routes>
    </Router>
  );
}

export default App;
