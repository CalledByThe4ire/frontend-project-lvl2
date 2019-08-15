import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getFormatter from './formatters';
import buildAST from './ast';
import sortAST from './helpers';

const parseData = (data) => {
  const extension = path.extname(data).slice(1);
  const parse = getParser(extension);
  return parse(fs.readFileSync(data, 'utf8'));
};

export default (filepath1, filepath2, outputFormat) => {
  const data1 = parseData(filepath1);
  const data2 = parseData(filepath2);
  const ast = buildAST(data1, data2);
  const sortedAST = sortAST(o => o.name, ast);
  const format = getFormatter(outputFormat);
  return format(sortedAST);
};
