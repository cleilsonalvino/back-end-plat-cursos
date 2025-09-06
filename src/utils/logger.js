// src/utils/logger.js
import chalk from 'chalk';

export function logSuccess(message) {
  console.log(chalk.green.bold('✔ SUCCESS:'), chalk.white(message));
}

export function logError(message) {
  console.error(chalk.red.bold('✖ ERROR:'), chalk.white(message));
}

export function logInfo(message) {
  console.log(chalk.blue.bold('ℹ INFO:'), chalk.white(message));
}
