import got from 'got';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import MovieGenerator from '../common/movie-generator/movie-generator.js';
import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;
  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const movieCount = Number.parseInt(count, 10);
    try {
      this.initialData = await got.get(url).json();
      console.log(this.initialData);
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }

    const movieGeneratorString = new MovieGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < movieCount; i++) {
      await tsvFileWriter.write(movieGeneratorString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
