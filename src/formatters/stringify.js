import { sortBy, toPairs, fromPairs } from 'lodash/fp';

const propertyActions = [
  {
    type: 'added',
    check() {
      return this.type;
    },
    process: (key, value) => ({ [`+ ${key}`]: value }),
  },
  {
    type: 'removed',
    check() {
      return this.type;
    },
    process: (key, value) => ({ [`- ${key}`]: value }),
  },
  {
    type: 'changed',
    check() {
      return this.type;
    },
    process: (key, value) => {
      const { before, after } = value;
      return {
        [`- ${key}`]: before,
        [`+ ${key}`]: after,
      };
    },
  },
  {
    type: 'unchanged',
    check() {
      return this.type;
    },
    process: (key, value) => ({ [key]: value }),
  },
];

const getPropertyAction = arg => propertyActions.find(value => arg === value.check());

const traverseChildren = (data, keyType) => data.reduce((acc, entry) => {
  const { key, value, children } = entry;
  const { process } = getPropertyAction(keyType);

  if (typeof value !== 'undefined') {
    return {
      ...acc,
      ...process(key, value),
    };
  }
  if (children) {
    return {
      ...acc,
      [key]: Object.keys(children).reduce(
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

const tagData = ast => Object.keys(ast).reduce(
  (acc, key) => ({
    ...acc,
    ...traverseChildren(ast[key], key),
  }),
  {},
);

const sort = (taggedObject, func) => {
  const sorted = fromPairs(sortBy(func, toPairs(taggedObject)));
  return Object.keys(sorted).reduce((acc, key) => {
    const value = sorted[key];
    if (value instanceof Object) {
      return { ...acc, [key]: sort(value, func) };
    }
    return { ...acc, [key]: value };
  }, sorted);
};

export default (ast) => {
  const tagged = tagData(ast);
  const sorted = sort(tagged, (entry) => {
    const [key] = entry;
    return key.replace(/[-+]\s/, '');
  });
  const iter = (object, factor) => Object.keys(object).reduce((acc, key) => {
    const newKey = key.match(/^[-+]/) ? key : `${' '.repeat(2)}${key}`;
    const value = object[key];
    let keyValuePair = '';

    if (value instanceof Object) {
      keyValuePair = `${' '.repeat(2 * factor)}${newKey}: {\n${iter(
        value,
        factor + 2,
      )}${' '.repeat(2 * factor + 2)}}\n`;
      return `${acc}${keyValuePair}`;
    }
    keyValuePair = `${newKey}: ${value}\n`;
    return `${acc}${' '.repeat(2 * factor)}${keyValuePair}`;
  }, '');
  return `{\n${iter(sorted, 1)}}`;
};
