import parse from './parsers';
import format from './formatters';
import buildAST from './ast';

export default (filepath1, filepath2, outputFormat) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const ast = buildAST(data1, data2);
  return format(outputFormat, ast);
};
