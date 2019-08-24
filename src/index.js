import 'source-map-support/register';
import { has, union, sortBy } from 'lodash/fp';
import fs from 'fs';
import path from 'path';

import getParser from './parsers';
import getFormatter from './formatters';

const parseData = (data) => {
  const extension = path.extname(data).slice(1);
  const parse = getParser(extension);
  return parse(fs.readFileSync(data, 'utf8'));
};

const buildAST = (data1 = {}, data2 = {}) => {
  const sortObjectKeys = obj => Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      if (obj[key] instanceof Object) {
        return {
          ...acc,
          [key]: sortObjectKeys(obj[key]),
        };
      }
      return {
        ...acc,
        [key]: obj[key],
      };
    }, {});
  const object1 = sortObjectKeys(data1);
  const object2 = sortObjectKeys(data2);

  return union(Object.keys(object1), Object.keys(object2)).map((key) => {
    if (has(key, object1) && has(key, object2)) {
      if (object1[key] instanceof Object && object2[key] instanceof Object) {
        return {
          type: 'inner',
          name: key,
          children: buildAST(object1[key], object2[key]),
        };
      }
      if (object1[key] === object2[key]) {
        return {
          type: 'unchanged',
          name: key,
          value: object1[key],
        };
      }
      return {
        type: 'changed',
        name: key,
        valueBefore: object1[key],
        valueAfter: object2[key],
      };
    }
    if (has(key, object1) && !has(key, object2)) {
      return {
        type: 'removed',
        name: key,
        value: object1[key],
      };
    }
    return {
      type: 'added',
      name: key,
      value: object2[key],
    };
  });
};

export default (filepath1, filepath2, outputFormat) => {
  const data1 = parseData(filepath1);
  const data2 = parseData(filepath2);
  const ast = buildAST(data1, data2);
  const format = getFormatter(outputFormat);
  return format(ast);
};

