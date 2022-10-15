export const genres = [
  "comedy",
  "crime",
  "documentary",
  "drama",
  "horror",
  "family",
  "romance",
  "scifi",
  "thriller",
];

const genresStrings: readonly string[] = genres;

export type Genre = typeof genres[number];

export function asGenre(s: string): Genre | never {
  if (genresStrings.includes(s)) {
    return s;
  }
  throw new Error(`Genre ${s} doesn't exist`);
}