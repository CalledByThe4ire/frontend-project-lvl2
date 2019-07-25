/* eslint-disable implicit-arrow-linebreak */

import parseFormat from './parsers/parse-format';
import buildAST from './parsers/parse-ast';
import stringify from './formatters/stringify';
import plain from './formatters/plain';


const formatters = {
  stringify,
  plain,
};

export default (file1, file2, outputFormat) => {
  const ast = buildAST(parseFormat(file1), parseFormat(file2));
  const formatter = formatters[outputFormat];
  console.log(formatter);
  return formatter(ast);
};
