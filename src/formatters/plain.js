const stringify = (value = '') => {
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
    return `${fn(children, `${name}.`).filter(string => string).join('\n')}`;
  },
  added: (name, args) => {
    const { value } = args;
    const stringifiedValue = stringify(value);
    return `Property '${name}' was added with value: ${stringifiedValue}`;
  },
  removed: name => `Property '${name}' was removed`,
  changed: (name, args) => {
    const { valueBefore, valueAfter } = args;
    const stringifiedValueBefore = stringify(valueBefore);
    const stringifiedValueAfter = stringify(valueAfter);

    return `Property '${name}' was updated. From ${stringifiedValueBefore} to ${stringifiedValueAfter}`;
  },
  unchanged: () => null,
};

export default (ast = []) => {
  const iter = (data, path = '') => data.map((entry) => {
    const { type, name, ...rest } = entry;
    const action = typeActions[type];
    return action(`${path}${name}`, rest, iter);
  });
  return iter(ast).join('\n');
};
