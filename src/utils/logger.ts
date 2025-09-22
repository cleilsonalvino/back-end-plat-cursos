import chalk from 'chalk';

export function logSuccess(message: string) {
  console.log(chalk.green.bold('✔ SUCCESS:'), chalk.white(message));
}

export function logError(message: string) {
  console.error(chalk.red.bold('✖ ERROR:'), chalk.white(message));
}

export function logInfo(message: string) {
  console.log(chalk.blue.bold('ℹ INFO:'), chalk.white(message));
}