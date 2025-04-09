
import { Card } from "../utils/types";

interface CarteProps {
    carte: Card | null;
    isVisible: boolean;
}

export default function Carte({ carte, isVisible }: CarteProps) {
    return !isVisible ? (
        <div className="carte-title">
            {carte && <h2>{carte.titre}</h2>}
        </div>
    ) : (
        <div className="carte-back">
            {carte && (
                <>
                    <h2>{carte.thematic}</h2>
                    <p>{carte.detail}</p>
                    <p>{carte.type}</p>
                    <p>{carte.date.toLocaleDateString()}</p>
                </>
            )}
        </div>
    );
}