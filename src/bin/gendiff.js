#!/usr/bin/env node

import commander from 'commander';
import genDiff from '..';

const program = new commander.Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'stringify')
  .arguments('<firstConfig> <secondConfig> [formatter]')
  .action((filepath1, filepath2) => {
    console.log(genDiff(filepath1, filepath2, program.format));
  })
  .parse(process.argv);

if (!program.args.length) program.help();
