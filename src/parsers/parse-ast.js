/* eslint-disable implicit-arrow-linebreak */
import { has } from 'lodash/fp';

const hasChildren = (key, object1, object2) =>
  object1[key] instanceof Object && object2[key] instanceof Object;

const getChildren = (key, object1, object2, func) => {
  if (hasChildren(key, object1, object2)) {
    return func(object1[key], object2[key]);
  }
  return {};
};

const getTagForKeysDifference = (object1, object2) =>
  Object.keys(object2).filter(key => !Object.keys(object1).includes(key));

const getType = (key, object1, object2) => {
  if (has(key, object1) && !has(key, object2)) {
    return 'removed';
  }
  if (has(key, object1) && has(key, object2)) {
    if (hasChildren(key, object1, object2) || object1[key] === object2[key]) {
      return 'unchanged';
    }
    if (object1[key] !== object2[key]) {
      return 'changed';
    }
  }
  return undefined;
};

const createByType = (type, key, object1, object2, func) => {
  const children = getChildren(key, object1, object2, func);
  switch (type) {
    case 'changed':
      return {
        key,
        value: {
          before: object1[key],
          after: object2[key],
        },
      };
    case 'unchanged':
    case 'removed':
      return {
        key,
        ...(Object.keys(children).length === 0 && { value: object1[key] }),
        ...(Object.keys(children).length !== 0 && { children }),
      };
    default:
      return {};
  }
};

const buildAST = (data1, data2) => {
  const object1 = data1;
  const object2 = data2;

  const root = {
    added: [],
    unchanged: [],
    changed: [],
    removed: [],
  };

  return Object.keys(object1).reduce((acc, key) => {
    const type = getType(key, object1, object2);
    const objectByType = createByType(type, key, object1, object2, buildAST);
    const newKeys = getTagForKeysDifference(object1, object2);
    const newKeyValuePairs = newKeys.map(k => ({ key: k, value: object2[k] }));
    const newAcc = { ...acc };
    newAcc.added = newAcc.added.length !== 0 ? newAcc.added : newKeyValuePairs;
    newAcc[type].push(objectByType);
    return {
      ...acc,
      ...newAcc,
    };
  }, root);
};

export default buildAST;
