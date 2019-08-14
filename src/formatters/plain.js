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
    return children.reduce((acc, child) => `${acc}${fn(child)}`, '');
  },
  added: (name, args) => {
    const { value } = args;
    const mappedValue = mapValue(value);
    return `Property '${name}' was added with value: ${mappedValue}\n`;
  },
  removed: name => `Property '${name}' was removed\n`,
  changed: (name, args) => {
    const { valueBefore, valueAfter } = args;
    const mappedValueBefore = mapValue(valueBefore);
    const mappedValueAfter = mapValue(valueAfter);

    return `Property '${name}' was updated. From ${mappedValueBefore} to ${mappedValueAfter}\n`;
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

const buildComplexName = (ast = [], searchName = '') => ast.reduce((acc, data) => {
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

const sort = (str = '') =>
  str
    .split('\n')
    .sort()
    .join('\n');

export default (ast = []) => {
  const mapData = (data) => {
    const { type, name, ...rest } = data;
    const buildAcc = typeActions[type];
    const complexName = buildComplexName(ast, name).join('.');
    const acc = buildAcc(complexName, rest, mapData);
    return acc;
  };
  const result = ast.reduce((acc, entry) => `${acc}${mapData(entry)}`, '');
  return sort(result);
};
