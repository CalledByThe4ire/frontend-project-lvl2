import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const formats = {
  json: 'json',
  yaml: 'yml',
  ini: 'ini',
};

const formatters = ['stringify', 'plain', 'json'];

const fixuturesPath = path.join(__dirname, '__fixtures__');

describe('gendiff', () => {
  formatters.forEach((formatter) => {
    describe(`output formatter: ${formatter}`, () => {
      const result = fs.readFileSync(
        path.join(fixuturesPath, `${formatter}.txt`),
        'utf8',
      );
      const table = Object.keys(formats).reduce((acc, format) => {
        const before = path.join(
          fixuturesPath,
          `${format}`,
          `before.${formats[format]}`,
        );
        const after = path.join(
          fixuturesPath,
          `${format}`,
          `after.${formats[format]}`,
        );

        return [...acc, [format, before, after, result]];
      }, []);

      test.each(table)('%s', (format, before, after, expected) => {
        expect(genDiff(before, after, formatter).trim()).toEqual(expected.trim());
      });
    });
  });
});
