/* eslint-disable implicit-arrow-linebreak */

import parseFormat from './parsers/parse-format';
import buildAST from './parsers/parse-ast';
import stringify from './formatters/stringify';

export default (file1, file2) => {
  const ast = buildAST(parseFormat(file1), parseFormat(file2));
  return stringify(ast);
};
