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
    id: string;
};
