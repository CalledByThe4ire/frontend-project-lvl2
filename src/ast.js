import { has } from 'lodash/fp';

const buildAST = (data1, data2) => {
  const object1 = data1;
  const object2 = data2;

  const object2Keys = Object.keys(object2)
    .filter(key => !Object.keys(object1).includes(key))
    .map(newKey => ({
      type: 'added',
      name: newKey,
      value: object2[newKey],
    }));

  const object1Keys = Object.keys(object1).reduce((acc, key) => {
    if (has(key, object2)) {
      if (object1[key] instanceof Object && object2[key] instanceof Object) {
        return [
          ...acc,
          {
            type: 'unchanged',
            name: key,
            children: buildAST(object1[key], object2[key]),
          },
        ];
      }
      if (object1[key] === object2[key]) {
        return [
          ...acc,
          {
            type: 'unchanged',
            name: key,
            value: object1[key],
          },
        ];
      }
      return [
        ...acc,
        {
          type: 'changed',
          name: key,
          valueBefore: object1[key],
          valueAfter: object2[key],
        },
      ];
    }
    return [
      ...acc,
      {
        type: 'removed',
        name: key,
        value: object1[key],
      },
    ];
  }, []);
  return [...object1Keys, ...object2Keys];
};

export default buildAST;
