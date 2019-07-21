/* eslint-disable implicit-arrow-linebreak */

import parseFormat from './parsers/parse-format';
import buildAST from './parsers/parse-ast';
import { tagKey, tagData, sort } from './helpers';
import stringify from './renderers/stringify';

export default (file1, file2) => {
  const ast = buildAST(parseFormat(file1), parseFormat(file2));
  const tagged = tagData(ast, tagKey);
  const sorted = sort(tagged, (entry) => {
    const [key] = entry;
    return key.replace(/[-+]\s/, '');
  });
  return stringify(sorted);
};
