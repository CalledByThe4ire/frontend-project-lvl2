import fs from 'fs';
import path from 'path';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import genDiff from '../src';
import { convertDiffToArray } from '../src/helpers';

const fixuturesPath = path.join(__dirname, '__fixtures__');
const before = JSON.parse(
  fs.readFileSync(path.join(fixuturesPath, 'before.json')),
);
const after = JSON.parse(
  fs.readFileSync(path.join(fixuturesPath, 'after.json')),
);
const result = fs.readFileSync(path.join(fixuturesPath, 'result.txt'), 'utf8');

console.log(sortBy(convertDiffToArray(genDiff(before, after))));
console.log(sortBy(convertDiffToArray(result)));

test('genDiff', () => {
  expect(
    isEqual(
      sortBy(convertDiffToArray(genDiff(before, after))),
      sortBy(convertDiffToArray(result)),
    ),
  ).toBeTruthy();
});
