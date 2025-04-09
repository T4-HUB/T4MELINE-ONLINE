export type Card = {
    thematic: string;
    titre: string;
    type: string;
    detail: string;
    date: Date;
}
export interface Player {
    name: string;
    score: number;
    color: string;
}
