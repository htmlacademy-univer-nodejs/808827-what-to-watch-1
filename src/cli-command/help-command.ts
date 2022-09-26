import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            ${chalk.green('main.js --<command> [--arguments]')}
        Команды:
            ${chalk.green('--version:')}                   # выводит номер версии
            ${chalk.green('--help:')}                      # печатает этот текст
            ${chalk.green('--import <path>:')}             # импортирует данные из TSV
            ${chalk.green('--generator <n> <path> <url>')} # генерирует произвольное количество тестовых данных
        `);
  }
}
