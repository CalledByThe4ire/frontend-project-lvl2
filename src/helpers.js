import { sortBy, toPairs, fromPairs } from 'lodash/fp';

/**
 * Сортирует объект на основе функции,
 * переданной в качестве параметра
 * @param {Object.<string, *>} obj
 * @param {(...args: any[]) => any} func
 * @returns {Object.<string, *>}
 */
const sort = (obj, func) => {
  const sorted = fromPairs(sortBy(func, toPairs(obj)));
  return Object.keys(sorted).reduce((acc, key) => {
    const value = sorted[key];
    if (value instanceof Object) {
      return { ...acc, [key]: sort(value, func) };
    }
    return { ...acc, [key]: value };
  }, sorted);
};

export default sort;
