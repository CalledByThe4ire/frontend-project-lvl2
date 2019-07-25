/* eslint-disable max-len, lodash-fp/no-extraneous-function-wrapping */

import { has } from 'lodash/fp';

const propertyActions = [
  {
    type: 'added',
    check() {
      return this.type;
    },
    process: (key, value) => {
      let newValue = value;

      if (value instanceof Object) {
        newValue = '[complex value]';
      } else if (typeof value === 'string') {
        newValue = `'${value}'`;
      }
      return `Property '${key}' was added with value: ${newValue}`;
    },
  },
  {
    type: 'removed',
    check() {
      return this.type;
    },
    process: key => `Property '${key}' was removed`,
  },
  {
    type: 'changed',
    check() {
      return this.type;
    },
    process: (key, value) => {
      let { before: newBefore, after: newAfter } = value;

      if (newBefore instanceof Object) {
        newBefore = '[complex value]';
      } else if (typeof newBefore === 'string') {
        newBefore = `${newBefore}`;
      }

      if (newAfter instanceof Object) {
        newAfter = '[complex value]';
      } else if (typeof newAfter === 'string') {
        newAfter = `${newAfter}`;
      }

      return `Property '${key}' was updated. From ${newBefore} to ${newAfter}`;
    },
  },
  {
    type: 'unchanged',
    check() {
      return this.type;
    },
    process: () => null,
  },
];

const getPropertyAction = arg => propertyActions.find(value => arg === value.check());

const hasKey = (data, searchKey) => {
  if (data) {
    const { key, children } = data;
    if (key === searchKey) {
      return true;
    }
    const filteredBySearchKey = children
      ? Object.keys(children).filter(type => children[type].filter(child => child.key === searchKey))
      : [];

    if (filteredBySearchKey.length !== 0) {
      return true;
    }
    const filteredByChildrenProperty = children
      ? children.unchanged.filter(child => has('children', child))
      : [];

    if (filteredByChildrenProperty.length === 0) {
      return false;
    }

    return filteredByChildrenProperty.reduce(
      (acc, entry) => acc && hasKey(entry, searchKey),
      true,
    );
  }
  return false;
};

const buildNestedPropertyPath = (tree, searchKey) => Object.keys(tree).reduce((acc, keyType) => {
  const filteredBySearchKey = tree[keyType].filter(value => hasKey(value, searchKey));
  if (filteredBySearchKey.length === 0) {
    return acc;
  }
  const [{ key, children }] = filteredBySearchKey;
  if (!children) {
    if (key === searchKey) {
      return [...acc, key];
    }
    return acc;
  }
  return [...[...acc, key], ...buildNestedPropertyPath(children, searchKey)];
}, []);

export default (ast) => {
  const traverseChildren = (data, keyType) => data.reduce((acc, entry) => {
    const { key, value, children } = entry;
    const nestedProperty = buildNestedPropertyPath(ast, key);
    const { process } = getPropertyAction(keyType);
    if (typeof value !== 'undefined') {
      return [...acc, process(nestedProperty.join('.'), value)];
    }
    if (children) {
      return [
        ...acc,
        ...Object.keys(children).reduce(
          (iAcc, n) => [...iAcc, ...traverseChildren(children[n], n)],
          [],
        ),
      ];
    }
    return [];
  }, []);

  return Object.keys(ast)
    .reduce((acc, key) => [...acc, ...traverseChildren(ast[key], key)], [])
    .filter(v => v)
    .slice()
    .sort()
    .join('\n');
};
