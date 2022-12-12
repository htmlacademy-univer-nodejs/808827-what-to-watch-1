import { asGenre } from '../types/genre.type.js';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import crypto from 'crypto';
import * as jose from 'jose';
import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { ValidationError } from 'class-validator';
import { ServiceError } from '../types/service-error.enum.js';
import { UnknownObject } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application-constant.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
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
  ] = tokens;
  return {
    title,
    description,
    publicationDate: new Date(publicationDate),
    genre: asGenre(genre),
    createdYear: Number(createdYear),
    rating: Number(rating),
    videoPreviewLink,
    videoLink,
    actors: actors.split(';'),
    director,
    movieDuration: Number(movieDuration),
    commentAmount: Number(commentAmount),
    user: {
      name: username,
      email,
      profilePictureLink,
      password,
    },
    posterLink,
    backgroundPictureLink,
    backgroundColor,
  };
};

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export function isPasswordValid(password: string): boolean {
  return password.length >= 6 && password.length <= 12;
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
  });
}

export const createErrorObject = (
  serviceError: ServiceError,
  message: string,
  details: ValidationErrorField[] = []
) => ({
  errorType: serviceError,
  message,
  details: [...details],
});

export const transformErrors = (
  errors: ValidationError[]
): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));

export const getFullServerPath = (host: string, port: number) =>
  `http://${host}:${port}`;

const isObject = (value: unknown) =>
  typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject).forEach((key) => {
    if (key === property) {
      transformFn(someObject);
    } else if (isObject(someObject[key])) {
      transformProperty(
        property,
        someObject[key] as UnknownObject,
        transformFn
      );
    }
  });
};

export const transformObject = (
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: UnknownObject
) => {
  properties.forEach((property) =>
    transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(
        target[property] as string
      )
        ? staticPath
        : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    })
  );
};

export const createJWT = async (
  algoritm: string,
  jwtSecret: string,
  payload: object
): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algoritm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
