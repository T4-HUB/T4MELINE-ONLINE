import Papa from "papaparse";
import { Card } from "../utils/types";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQlzxMUajqLjmCZ_I-NAie0g-ZxTsJqjOnj6R-w139EnpG-XY3DTJ4Hg5iTtzgnfQmSxJnhu0Tl502b/pub?gid=1517720865&single=true&output=csv";

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function loadCards(limit?: number): Promise<Card[]> {
  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const csvText = await response.text();

  return new Promise<Card[]>((resolve, reject) => {
    Papa.parse(csvText, {
      complete: (result) => {
        // Filtrer les lignes où une ou plusieurs cases sont vides
        const validRows = result.data.filter((row: any) => {
          // Vérifie si toutes les cases de la ligne ne sont pas vides
          return Object.values(row).every(
            (value: any) => value && value.trim() !== ""
          );
        });

        console.log("Lignes valides :", validRows); // Afficher les lignes valides dans la console
        const shuffledRows = shuffleArray(validRows);

        // Appliquer la limite si elle est définie
        const limitedRows = limit ? shuffledRows.slice(0, limit) : shuffledRows;
        resolve(limitedRows as Card[]); // Retourner les lignes valides
      },
      header: true, // Utilisation de la première ligne comme entête
    });
  });
}
