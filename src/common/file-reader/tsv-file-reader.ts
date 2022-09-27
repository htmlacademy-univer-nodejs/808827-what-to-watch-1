import { readFileSync } from 'fs';
import { Genre } from '../../types/genre.type.js';
import { Movie } from '../../types/movie.type.js';
import { User } from '../../types/user.type.js';

import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Movie[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          publicationDate,
          genre,
          createdYear,
          rating,
          videoPreviewLink,
          videoLink,
          actors,
          director,
          movieDuration,
          commentAmount,
          username,
          email,
          profilePictureLink,
          password,
          posterLink,
          backgroundPictureLink,
          backgroundColor,
        ]) => ({
          title,
          description,
          publicationDate,
          genre: genre as Genre,
          createdYear: parseInt(createdYear, 10) as number,
          rating: parseFloat(rating) as number,
          videoPreviewLink,
          videoLink,
          actors: actors.split(';'),
          director,
          movieDuration: parseInt(movieDuration, 10) as number,
          commentAmount: parseInt(commentAmount, 10) as number,
          user: {
            name: username,
            email,
            profilePictureLink,
            password,
          } as User,
          posterLink,
          backgroundPictureLink,
          backgroundColor,
        })
      );
  }
}
