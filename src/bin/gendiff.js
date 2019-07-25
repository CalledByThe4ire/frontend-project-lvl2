#!/usr/bin/env node

import commander from 'commander';
import genDiff from '..';

const program = new commander.Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'stringify')
  .arguments('<firstConfig> <secondConfig> [formatter]')
  .action((arg1, arg2, output) => {
    const file1 = arg1;
    const file2 = arg2;
    const formatter = output || program.format;
    console.log(genDiff(file1, file2, formatter));
  })
  .parse(process.argv);

if (!program.args.length) program.help();
