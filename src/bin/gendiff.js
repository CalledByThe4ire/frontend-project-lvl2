#!/usr/bin/env node

import commander from 'commander';
import genDiff from '..';

const program = new commander.Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'string representation of a Javascript object')
  .arguments('<firstConfig> <secondConfig>')
  .action((arg1, arg2) => console.log(genDiff(arg1, arg2), program.format))
  .parse(process.argv);

if (!program.args.length) program.help();
