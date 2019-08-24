import { flattenDeep } from 'lodash/fp';

const mapValue = (value = '') => {
  if (value instanceof Object) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return `${value}`;
};

const typeActions = {
  inner: (name, args, fn) => {
    const { children } = args;
    return fn(children);
  },
  added: (name, args) => {
    const { value } = args;
    const mappedValue = mapValue(value);
    return `Property '${name}' was added with value: ${mappedValue}`;
  },
  removed: name => `Property '${name}' was removed`,
  changed: (name, args) => {
    const { valueBefore, valueAfter } = args;
    const mappedValueBefore = mapValue(valueBefore);
    const mappedValueAfter = mapValue(valueAfter);

    return `Property '${name}' was updated. From ${mappedValueBefore} to ${mappedValueAfter}`;
  },
  unchanged: () => '',
};

const hasSearchName = (data = {}, searchName = '') => {
  const { name, children } = data;
  if (name === searchName) {
    return true;
  }
  if (children) {
    return children.some(child => hasSearchName(child, searchName));
  }
  return false;
};

const buildComplexName = (ast = [], searchName = '') =>
  ast.reduce((acc, data) => {
    if (!hasSearchName(data, searchName)) {
      return acc;
    }
    const { name, children } = data;

    if (children) {
      return [...acc, name, ...buildComplexName(children, searchName)];
    }

    if (name === searchName) {
      return [...acc, name];
    }
    return acc;
  }, []);

export default (ast = []) => {
  const map = data =>
    data.map((entry) => {
      const { type, name, ...rest } = entry;
      const buildAcc = typeActions[type];
      const complexName = buildComplexName(ast, name).join('.');
      return [buildAcc(complexName, rest, map)];
    }, []);

  const mapped = map(ast);
  const flattened = flattenDeep(mapped);
  const filtered = flattened.filter(string => string);
  const stringified = filtered.join('\n');

  return stringified;
};
