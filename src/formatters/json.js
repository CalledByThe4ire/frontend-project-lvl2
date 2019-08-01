import { identity } from 'lodash/fp';

const propertyActions = [
  {
    type: 'added',
    checkType() {
      return this.type;
    },
    updateNumberOfPropertyStateChange: (previousValue, tree, key) => previousValue + tree[key].length,
  },
  {
    type: 'removed',
    checkType() {
      return this.type;
    },
    updateNumberOfPropertyStateChange: (previousValue, tree, key) => previousValue + tree[key].length,
  },
  {
    type: 'changed',
    checkType() {
      return this.type;
    },
    updateNumberOfPropertyStateChange: (previousValue, tree, key) => previousValue + tree[key].length,
  },
  {
    type: 'unchanged',
    checkType() {
      return this.type;
    },
    updateNumberOfPropertyStateChange: identity,
  },
];

const getPropertyAction = arg =>
  propertyActions.find(value => arg === value.checkType());

const countNumberOfPropertyStateChange = (ast, state) =>
  Object.keys(ast).reduce((acc, keyType) => {
    if (keyType !== state) {
      return acc;
    }

    const { updateNumberOfPropertyStateChange } = getPropertyAction(keyType);
    const newAcc = updateNumberOfPropertyStateChange(acc, ast, keyType);

    return ast.unchanged.reduce((iAcc, value) => {
      const { children } = value;
      const newIAcc = keyType === 'unchanged' ? iAcc + 1 : iAcc;
      if (!children) {
        return newIAcc;
      }
      return newIAcc + countNumberOfPropertyStateChange(children, state);
    }, newAcc);
  }, 0);

export default ast =>
  JSON.stringify(
    {
      addedPropertiesCount: countNumberOfPropertyStateChange(ast, 'added'),
      removedPropertiesCount: countNumberOfPropertyStateChange(ast, 'removed'),
      changedPropertiesCount: countNumberOfPropertyStateChange(ast, 'changed'),
      unchangedPropertiesCount: countNumberOfPropertyStateChange(ast, 'unchanged'),
    },
    null,
    '\t',
  );
