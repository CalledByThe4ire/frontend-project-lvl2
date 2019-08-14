import { sortBy, toPairs, fromPairs } from 'lodash/fp';

const typeActions = {
  inner: (name, args, fn) => {
    const { children } = args;
    return {
      [name]: children.reduce((acc, child) => ({ ...acc, ...fn(child) }), {}),
    };
  },
  added: (name, args) => {
    const { value } = args;
    return { [`+ ${name}`]: value };
  },
  removed: (name, args) => {
    const { value } = args;
    return { [`- ${name}`]: value };
  },
  changed: (name, args) => {
    const { valueBefore, valueAfter } = args;
    return {
      [`- ${name}`]: valueBefore,
      [`+ ${name}`]: valueAfter,
    };
  },
  unchanged: (name, args) => {
    const { value } = args;
    return { [name]: value };
  },
};

const format = (ast = []) => {
  const mapData = (data) => {
    const { type, name, ...rest } = data;
    const buildAcc = typeActions[type];
    const acc = buildAcc(name, rest, mapData);
    return acc;
  };
  return ast.reduce((acc, entry) => ({ ...acc, ...mapData(entry) }), {});
};

const sort = (func = () => {}, object = {}) => {
  const sorted = fromPairs(sortBy(func, toPairs(object)));
  return Object.keys(sorted).reduce((acc, key) => {
    const value = sorted[key];
    if (value instanceof Object) {
      return { ...acc, [key]: sort(func, value) };
    }
    return { ...acc, [key]: value };
  }, {});
};

export default (object) => {
  if (typeof object === 'undefined' || Object.keys(object).length === 0) {
    return '';
  }

  const formatted = format(object);
  const sorted = sort((entry) => {
    const [key] = entry;
    return key.replace(/[-+]\s/, '');
  }, formatted);

  const iter = (data = {}, factor = 1) =>
    Object.keys(data).reduce((acc, key) => {
      const newKey = key.match(/^[-+]/) ? key : `${' '.repeat(2)}${key}`;
      const value = data[key];
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
  return `{\n${iter(sorted)}}`;
};
