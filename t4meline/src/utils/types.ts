export type Card = {
  id: number;
  thematic: string;
  titre: string;
  type: string;
  detail: string;
  date: number;
};
export interface Player {
  name: string;
  score: number;
  color: string;
}
