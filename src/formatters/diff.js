import { flatten } from 'lodash/fp';

const calcOffset = (factor, times = 2) => ' '.repeat(times * factor);

const stringifyValue = (value, factor) => {
  if (!(value instanceof Object)) {
    return value;
  }
  return `{\n${[...Object.keys(value)].map(
    key => `${calcOffset(factor + 1)}${key}: ${value[key]}`,
  )}\n${calcOffset(factor)}}`;
};

const typeActions = {
  inner: (props, offset, factor, fn) => {
    const { name, children } = props;
    return `${offset}${name}: {\n${flatten(fn(children, factor + 1)).join(
      '\n',
    )}\n${offset}}`;
  },
  added: (props, offset, factor) => {
    const { name, value } = props;
    return `${offset}+ ${name}: ${stringifyValue(value, factor)}`;
  },
  removed: (props, offset, factor) => {
    const { name, value } = props;
    return `${offset}+ ${name}: ${stringifyValue(value, factor)}`;
  },
  changed: (props, offset, factor) => {
    const { name, valueBefore, valueAfter } = props;
    return [
      `${offset}- ${name}: ${stringifyValue(valueBefore, factor)}`,
      `${offset}+ ${name}: ${stringifyValue(valueAfter, factor)}`,
    ];
  },
  unchanged: (props, offset, factor) => {
    const { name, value } = props;
    return `${offset}${name}: ${stringifyValue(value, factor)}`;
  },
};
export default (ast) => {
  const iter = (data, factor = 1) => data.map((entry) => {
    const { type, ...props } = entry;
    const offset = calcOffset(factor);
    const action = typeActions[type];

    return action(props, offset, factor, iter);
  });
  return `{\n${flatten(iter(ast)).join('\n')}\n}`;
};
