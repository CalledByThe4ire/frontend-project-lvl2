import fs from 'fs';
import getParser from './parsers';

export default (data) => {
  const parser = getParser(data);
  return parser(fs.readFileSync(data, 'utf8'));
};
