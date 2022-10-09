import { MockData } from '../../types/mock-data.type.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../utils/random.js';
import { MovieGeneratorInterface } from './movie-generator.interface.js';
import dayjs from 'dayjs';

const MIN_YEAR = 1970;
const MAX_YEAR = 2022;
const MIN_DURATION = 1;
const MAX_DURATION = 180;
const MIN_RATING = 1.0;
const MAX_RATING = 10.0;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 100;

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItem<string>(this.mockData.genres);
    const createdYear = generateRandomValue(MIN_YEAR, MAX_YEAR);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const videoPreviewLink = getRandomItem<string>(
      this.mockData.videoPreviewLinks
    );
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.directors);
    const movieDuration = generateRandomValue(MIN_DURATION, MAX_DURATION);
    const commentAmount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS);
    const username = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatarPaths);
    const password = getRandomItem<string>(this.mockData.passwords);
    const poster = getRandomItem<string>(this.mockData.posterPaths);
    const backgroundImage = getRandomItem<string>(
      this.mockData.backgroundPicturePaths
    );
    const backgroundColor = getRandomItem<string>(
      this.mockData.backgroundColors
    );

    return [
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
      password,
      avatar,
      poster,
      backgroundImage,
      backgroundColor,
    ].join('\t');
  }
}
