/* eslint-disable  implicit-arrow-linebreak */
import { identity } from 'lodash/fp';

const propertyActions = [
  {
    type: 'added',
    check() {
      return this.type;
    },
    process: (previousValue, tree, key) => previousValue + tree[key].length,
  },
  {
    type: 'removed',
    check() {
      return this.type;
    },
    process: (previousValue, tree, key) => previousValue + tree[key].length,
  },
  {
    type: 'changed',
    check() {
      return this.type;
    },
    process: (previousValue, tree, key) => previousValue + tree[key].length,
  },
  {
    type: 'unchanged',
    check() {
      return this.type;
    },
    process: identity,
  },
];

const getPropertyAction = arg =>
  propertyActions.find(value => arg === value.check());

const countNumberOfStateChange = (ast, state) =>
  Object.keys(ast).reduce((acc, keyType) => {
    if (keyType !== state) {
      return acc;
    }

    const { process } = getPropertyAction(keyType);
    const newAcc = process(acc, ast, keyType);

    return ast.unchanged.reduce((iAcc, value) => {
      const { children } = value;
      const newIAcc = keyType === 'unchanged' ? iAcc + 1 : iAcc;
      if (!children) {
        return newIAcc;
      }
      return newIAcc + countNumberOfStateChange(children, state);
    }, newAcc);
  }, 0);

export default ast =>
  JSON.stringify(
    {
      addedPropertiesCount: countNumberOfStateChange(ast, 'added'),
      removedPropertiesCount: countNumberOfStateChange(ast, 'removed'),
      changedPropertiesCount: countNumberOfStateChange(ast, 'changed'),
      unchangedPropertiesCount: countNumberOfStateChange(ast, 'unchanged'),
    },
    null,
    '\t',
  );
