import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getFormatter from './formatters';
import buildAST from './ast';

const parse = (data) => {
  const extension = path.extname(data).slice(1);
  const parser = getParser(extension);
  return parser(fs.readFileSync(data, 'utf8'));
};

export default (filepath1, filepath2, outputFormat) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const ast = buildAST(data1, data2);
  const formatter = getFormatter(outputFormat);
  return formatter(ast);
};
