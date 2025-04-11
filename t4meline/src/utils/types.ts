export type Card = {
    id: number;
    thematic: string;
    titre: string;
    type: string;
    detail: string;
    date: number;
};
export type Player = {
    name: string;
    score: number;
    isReady: boolean;
    isCurrentPlayer: boolean; // Indique si le joueur est le joueur actuel
    socketId?: string; 

    id: string;
};
