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

export default (filepath1, filepath2, outputFormat) => {
  const ast = buildAST(parseFormat(filepath1), parseFormat(filepath2));
  const formatter = formatters[outputFormat];
  return formatter(ast);
};
