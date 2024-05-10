/* eslint-disable consistent-return */

/* eslint-disable no-console */
import chalk from 'chalk';
import * as childProcess from 'child_process';
import * as readLineSync from 'readline-sync';

export const releaseTypes = ['Major', 'Minor', 'Patch'];

export const COLORS = {
  INFO: chalk.cyan,
  ERR: chalk.red,
};

export const INFO_HEADER = `${chalk.black(chalk.bgCyan('INFO:'))} `;
export const ERROR_HEADER = `${chalk.bgRed('Error:')} `;

export const info = (msg) => console.log(INFO_HEADER + COLORS.INFO(msg));
export const error = (msg) => console.log(ERROR_HEADER + COLORS.ERR(msg));

export const rl = {
  keyInSelect: (opts, msg) => readLineSync.keyInSelect(opts, COLORS.INFO(msg)),
  keyInYN: (msg) => readLineSync.keyInYN(COLORS.INFO(msg)),
};

export const execSync = (cmd) => {
  try {
    return childProcess.execSync(cmd, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
  } catch (err) {
    process.exit(1);
  }
};

export const getLatestTag = () => {
  return execSync('git describe --tags $(git rev-list --tags --max-count=1)');
};
