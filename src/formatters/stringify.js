import { sortBy, toPairs, fromPairs } from 'lodash/fp';

const propertyActions = [
  {
    type: 'added',
    check() {
      return this.type;
    },
    process: (name, args) => {
      const { value } = args;
      return { [`+ ${name}`]: value };
    },
  },
  {
    type: 'removed',
    check() {
      return this.type;
    },
    process: (name, args) => {
      const { value } = args;
      return { [`- ${name}`]: value };
    },
  },
  {
    type: 'changed',
    check() {
      return this.type;
    },
    process: (name, args) => {
      const { valueBefore, valueAfter } = args;
      return {
        [`- ${name}`]: valueBefore,
        [`+ ${name}`]: valueAfter,
      };
    },
  },
  {
    type: 'unchanged',
    check() {
      return this.type;
    },
    process: (name, args) => {
      const { value } = args;
      return { [name]: value };
    },
  },
];

const getPropertyAction = arg =>
  propertyActions.find(value => arg === value.check());

const format = (ast) => {
  const mapData = (data) => {
    const { type, name, ...rest } = data;
    const { children } = rest;
    const { process } = getPropertyAction(type);

    if (children) {
      return {
        [name]: children.reduce(
          (acc, child) => ({ ...acc, ...mapData(child) }),
          {},
        ),
      };
    }
    return process(name, rest);
  };
  return ast.reduce((acc, entry) => ({ ...acc, ...mapData(entry) }), {});
};

const sort = (func, obj) => {
  const sorted = fromPairs(sortBy(func, toPairs(obj)));
  return Object.keys(sorted).reduce((acc, key) => {
    const value = sorted[key];
    if (value instanceof Object) {
      return { ...acc, [key]: sort(func, value) };
    }
    return { ...acc, [key]: value };
  }, {});
};

export default (obj) => {
  const formatted = format(obj);
  const sorted = sort((entry) => {
    const [key] = entry;
    return key.replace(/[-+]\s/, '');
  }, formatted);

  const iter = (data, factor) =>
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
  return `{\n${iter(sorted, 1)}}`;
};
