/* eslint-disable implicit-arrow-linebreak */

import parseFormat from './parsers/parse-format';
import buildAST from './parsers/parse-ast';
import stringify from './formatters/stringify';
import plain from './formatters/plain';
import json from './formatters/json';


const formatters = {
  stringify,
  plain,
  json,
};

export default (file1, file2, outputFormat) => {
  const ast = buildAST(parseFormat(file1), parseFormat(file2));
  const formatter = formatters[outputFormat];
  return formatter(ast);
};
