/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';

/**
 * @const {Object.<string, *>}
 */
const parsers = {
  json: JSON.parse,
};

/**
 * Принимает на вход файл,
 * подбирает в зависимости от его расширения
 * соответствующую функцию и вызывает ее с переданным файлом
 * @param {string} data
 * @returns {Object.<string, *>}
 */
export default (data) => {
  const parser = parsers[path.extname(data).slice(1)];
  return parser(fs.readFileSync(data, 'utf8'));
};
