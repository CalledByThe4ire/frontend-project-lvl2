import fs from 'fs';
import path from 'path';

const parsers = {
  json: JSON.parse,
};

export default (data) => {
  const parser = parsers[path.extname(data).slice(1)];
  return parser(fs.readFileSync(data, 'utf8'));
};
