import fs from 'fs';
import path from 'path';
import genDiff from '../src';
import { parse } from '../src/helpers';

const fixuturesPath = path.join(__dirname, '__fixtures__');
const before = JSON.parse(
  fs.readFileSync(path.join(fixuturesPath, 'before.json')),
);
const after = JSON.parse(
  fs.readFileSync(path.join(fixuturesPath, 'after.json')),
);
const result = fs.readFileSync(path.join(fixuturesPath, 'result.txt'), 'utf8');

test('genDiff', () => {
  expect(parse(genDiff(before, after))).toBe(parse(result));
});
