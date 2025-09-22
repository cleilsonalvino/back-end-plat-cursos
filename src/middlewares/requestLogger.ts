import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';

const pad = (s: string, n: number) => (s + ' '.repeat(n)).slice(0, n);

const colorByStatus = (code: number) => {
  if (code >= 500) return chalk.bgRed.black(` ${code} `);
  if (code >= 400) return chalk.bgYellow.black(` ${code} `);
  if (code >= 300) return chalk.bgBlue.black(` ${code} `);
  return chalk.bgGreen.black(` ${code} `);
};

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;

    const ts = chalk.gray(new Date().toLocaleTimeString());
    const method = chalk.bold(pad(req.method, 6));
    const url = chalk.cyan(req.originalUrl);
    const status = colorByStatus(res.statusCode);
    const time = chalk.magenta(`${ms.toFixed(1)}ms`);

    // linha estilo “bootstrap card”
    console.log(`${ts} ${status} ${method} ${url} ${chalk.gray('•')} ${time}`);
  });
  next();
}