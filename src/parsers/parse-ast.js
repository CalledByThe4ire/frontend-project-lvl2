/* eslint-disable implicit-arrow-linebreak */
import { has } from 'lodash/fp';

const hasChildren = (key, obj1, obj2) =>
  obj1[key] instanceof Object && obj2[key] instanceof Object;

const getChildren = (key, obj1, obj2, func) => {
  if (hasChildren(key, obj1, obj2)) {
    return func(obj1[key], obj2[key]);
  }
  return {};
};

const getTagForKeysDifference = (obj1, obj2) =>
  Object.keys(obj2).filter(key => !Object.keys(obj1).includes(key));

const getType = (key, obj1, obj2) => {
  if (has(key, obj1) && !has(key, obj2)) {
    return 'removed';
  }
  if (has(key, obj1) && has(key, obj2)) {
    if (hasChildren(key, obj1, obj2) || obj1[key] === obj2[key]) {
      return 'unchanged';
    }
    if (obj1[key] !== obj2[key]) {
      return 'changed';
    }
  }
  return undefined;
};

const createByType = (type, key, obj1, obj2, func) => {
  const children = getChildren(key, obj1, obj2, func);
  switch (type) {
    case 'changed':
      return {
        key,
        value: {
          before: obj1[key],
          after: obj2[key],
        },
      };
    case 'unchanged':
    case 'removed':
      return {
        key,
        ...(Object.keys(children).length === 0 && { value: obj1[key] }),
        ...(Object.keys(children).length !== 0 && { children }),
      };
    default:
      return {};
  }
};

const buildAST = (data1, data2) => {
  const obj1 = data1;
  const obj2 = data2;

  const root = {
    added: [],
    unchanged: [],
    changed: [],
    removed: [],
  };

  return Object.keys(obj1).reduce((acc, key) => {
    const type = getType(key, obj1, obj2);
    const objByType = createByType(type, key, obj1, obj2, buildAST);
    const newKeys = getTagForKeysDifference(obj1, obj2);
    const newKeyValuePairs = newKeys.map(k => ({ key: k, value: obj2[k] }));
    const newAcc = { ...acc };
    newAcc.added = newAcc.added.length !== 0 ? newAcc.added : newKeyValuePairs;
    newAcc[type].push(objByType);
    return {
      ...acc,
      ...newAcc,
    };
  }, root);
};

export default buildAST;
