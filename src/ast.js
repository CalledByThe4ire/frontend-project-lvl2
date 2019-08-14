import { has, union } from 'lodash/fp';

const buildAST = (data1 = {}, data2 = {}) => {
  const object1 = data1;
  const object2 = data2;

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

export default buildAST;
