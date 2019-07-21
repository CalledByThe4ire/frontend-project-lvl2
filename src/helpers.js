import { sortBy, toPairs, fromPairs } from 'lodash/fp';
import tags from './tags';

const getTag = (tagType) => {
  const data = tags.get(tagType);
  if (typeof data === 'string') {
    return [data];
  }
  if (data instanceof Object) {
    const { before, after } = data;
    return [before, after];
  }
  return [];
};

export const tagKey = (key, tagType) => {
  const tagSymbol = getTag(tagType);

  if (tagType === 'changed') {
    const [tagSymbolBefore, tagSymbolAfter] = tagSymbol;
    return [`${tagSymbolBefore} ${key}`, `${tagSymbolAfter} ${key}`];
  }
  return [`${tagSymbol} ${key}`.trim()];
};

export const tagData = (ast, func) => {
  const traverseChildren = (data, keyData) => data.reduce((acc, entry) => {
    const { key, value, children } = entry;
    const newKey = func(key, keyData);

    if (typeof value !== 'undefined') {
      if (keyData === 'changed') {
        const [taggedKeyBefore, taggedKeyAfter] = newKey;
        return {
          ...acc,
          [taggedKeyBefore]: value.before,
          [taggedKeyAfter]: value.after,
        };
      }
      const [taggedKey] = newKey;
      return {
        ...acc,
        [taggedKey]: value,
      };
    }
    if (children) {
      const [taggedKey] = newKey;
      return {
        ...acc,
        [taggedKey]: Object.keys(children).reduce(
          (iAcc, n) => ({
            ...iAcc,
            ...traverseChildren(children[n], n),
          }),
          {},
        ),
      };
    }
    return {};
  }, {});
  return Object.keys(ast).reduce(
    (acc, key) => ({ ...acc, ...traverseChildren(ast[key], key) }),
    {},
  );
};

export const sort = (obj, func) => {
  const sorted = fromPairs(sortBy(func, toPairs(obj)));
  return Object.keys(sorted).reduce((acc, key) => {
    const value = sorted[key];
    if (value instanceof Object) {
      return { ...acc, [key]: sort(value, func) };
    }
    return { ...acc, [key]: value };
  }, sorted);
};
