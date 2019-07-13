/* eslint-disable lodash/prefer-lodash-method */

import fs from 'fs';
import path from 'path';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';

import genDiff from '../src';
import { convertDiffToArray } from '../src/helpers';

const formats = {
  json: 'json',
  yaml: 'yml',
  ini: 'ini',
};

const fixuturesPath = path.join(__dirname, '__fixtures__');
const result = fs.readFileSync(path.join(fixuturesPath, 'result.txt'), 'utf8');

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

  return [...acc, [before, after, result]];
}, []);

test.each(table)('genDiff %#', (before, after, expected) => {
  expect(
    isEqual(
      sortBy(convertDiffToArray(genDiff(before, after))),
      sortBy(convertDiffToArray(expected)),
    ),
  ).toBeTruthy();
});
