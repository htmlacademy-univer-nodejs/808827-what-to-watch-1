import { Genre } from "./genre.type"
import { User } from "./user.type"

export type Movie = {
  title: string,
  description: string,
  publicationDate: string,
  genre: Genre,
  createdYear: number,
  rating: number,
  videoPreviewLink: string,
  videoLink: string,
  actors: string[],
  director: string,
  movieDuration: number,
  commentAmount: number,
  user: User,
  posterLink: string,
  backgroundPictureLink: string,
  backgroundColor: string,
}