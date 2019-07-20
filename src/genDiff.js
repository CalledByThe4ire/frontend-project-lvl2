/* eslint-disable max-len, implicit-arrow-linebreak */

import parseFormat from './parsers/parse-format';
import buildAST from './parsers/parse-to-ast';
import sort from './helpers';
import { convertor, stringify } from './renderers/stringify';

export default (file1, file2) =>
  stringify(sort(convertor(buildAST(parseFormat(file1), parseFormat(file2)))));
