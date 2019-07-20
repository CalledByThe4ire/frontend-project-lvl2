/**
 * @type {Map<string:string>}
 */
const tags = new Map([
  ['added', '+'],
  ['removed', '-'],
  ['changed', { before: '-', after: '+' }],
  ['unchanged', ' '],
]);

/**
 * Возвращает значение из словаря на основе ключа,
 * переданного в качестве параметра
 * @param {string} tagType
 * @returns {Array<string>}
 */
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

/**
 * Форматирует строку (ключ)
 * @param {string} key
 * @param {string} tagType
 * @returns {Array<string>}
 */
const tagKey = (key, tagType) => {
  const tagSymbol = getTag(tagType);

  if (tagType === 'changed') {
    const [tagSymbolBefore, tagSymbolAfter] = tagSymbol;
    return [`${tagSymbolBefore} ${key}`, `${tagSymbolAfter} ${key}`];
  }
  return [`${tagSymbol} ${key}`.trim()];
};

export default (ast) => {
  /**
  * @typedef {Object} taggedObject
  * @prop {string} key
  * @prop {*} value
  * @prop {taggedObject} children
  */
  /**
   * Разбирает АСД и формирует на его основе
   * объект с тегированными ключами
   * @param {Array<taggedObject>} data
   * @param {string} keyData
   * @param {(...args: any[]) => any} func
   * @returns {<string, *>}
   */
  const tagData = (data, keyData, func) => data.reduce((acc, entry) => {
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
            ...tagData(children[n], n, func),
          }),
          {},
        ),
      };
    }
    return acc;
  }, {});
  return Object.keys(ast).reduce(
    (acc, key) => ({ ...acc, ...tagData(ast[key], key, tagKey) }),
    {},
  );
};
