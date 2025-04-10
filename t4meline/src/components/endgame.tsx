import { useLocation } from "react-router";
import Leaderboard from "./players";
import { useNavigate } from "react-router";

export default function EndGame() {
    const location = useLocation();
    const { players } = location.state || { players: [] };
    const navigate = useNavigate();
    return (
        <>
            <h2>Fin de partie</h2>
            <h3>Résultats :</h3>
            <Leaderboard players={players} />
            <button
                onClick={() => {
                    navigate("/");
                    window.location.reload(); // Recharger la page pour réinitialiser l'état
                }}
            >
                Rejouer
            </button>
        </>

    )
}