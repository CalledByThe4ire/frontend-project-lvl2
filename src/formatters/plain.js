const mapValue = (value = '') => {
  if (value instanceof Object) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return `${value}`;
};

const propertyActions = [
  {
    type: 'added',
    check() {
      return this.type;
    },
    process: (name = '', args = {}) => {
      const { value } = args;
      const mappedValue = mapValue(value);
      return `Property '${name}' was added with value: ${mappedValue}\n`;
    },
  },
  {
    type: 'removed',
    check() {
      return this.type;
    },
    process: (name = '') => `Property '${name}' was removed\n`,
  },
  {
    type: 'changed',
    check() {
      return this.type;
    },
    process: (name = '', args = {}) => {
      const { valueBefore, valueAfter } = args;
      const mappedValueBefore = mapValue(valueBefore);
      const mappedValueAfter = mapValue(valueAfter);

      return `Property '${name}' was updated. From ${mappedValueBefore} to ${mappedValueAfter}\n`;
    },
  },
  {
    type: 'unchanged',
    check() {
      return this.type;
    },
    process: () => '',
  },
];

const getPropertyAction = (arg = []) =>
  propertyActions.find(value => arg === value.check());

const hasName = (data = {}, searchName = '') => {
  const { name, children } = data;
  if (name === searchName) {
    return true;
  }
  if (children) {
    return children.some(child => hasName(child, searchName));
  }
  return false;
};

const buildComplexName = (
  f = () => {},
  data = {},
  searchName = '',
  acc = [],
) => {
  const { name, children } = data;
  const newAcc = f(acc, data);

  if (!children) {
    if (name === searchName) {
      return newAcc;
    }
    return acc;
  }
  if (hasName(data, searchName)) {
    return children.reduce(
      (iAcc, child) => buildComplexName(f, child, searchName, iAcc),
      newAcc,
    );
  }
  return acc;
};

const sort = (str = '') =>
  str
    .split('\n')
    .sort()
    .join('\n');

export default (ast = []) => {
  const mapData = (data) => {
    const { type, name, ...rest } = data;
    const { children } = rest;
    const { process } = getPropertyAction(type);

    if (children) {
      return children.reduce((acc, child) => `${acc}${mapData(child)}`, '');
    }

    const complexName = buildComplexName(
      (acc, { name: dataName }) => [...acc, dataName],
      ast.find(value => hasName(value, name)),
      name,
      [],
    ).join('.');
    return process(complexName, rest);
  };
  const result = ast.reduce((acc, v) => `${acc}${mapData(v)}`, '');
  return sort(result);
};
