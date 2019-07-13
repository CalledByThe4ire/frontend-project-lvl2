import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

export default (data) => {
  const parser = parsers[path.extname(data).slice(1)];
  return parser(fs.readFileSync(data, 'utf-8'));
};
