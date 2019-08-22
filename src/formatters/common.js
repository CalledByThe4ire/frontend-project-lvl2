const mapValue = (data, times, step) => {
  if (data instanceof Object) {
    const result = Object.keys(data).reduce(
      (acc, key) => [...acc, `${' '.repeat(times + step)}${key}: ${data[key]}`],
      [],
    );
    return `{\n${result.join('\n')}\n${' '.repeat(times)}}`;
  }
  return `${data}`;
};

const typeActions = {
  inner: (props, times, step, fn) => {
    const { name, children } = props;
    return `${' '.repeat(times + step)}${name}: {\n${fn(
      children,
      times + step * 2,
      step,
    ).join('\n')}\n${' '.repeat(times + step)}}`;
  },
  added: (props, times, step) => {
    const { name, value } = props;
    return `${' '.repeat(times)}+ ${name}: ${mapValue(
      value,
      times + step,
      step,
    )}`;
  },
  removed: (props, times, step) => {
    const { name, value } = props;
    return `${' '.repeat(times)}- ${name}: ${mapValue(
      value,
      times + step,
      step,
    )}`;
  },
  changed: (props, times, step) => {
    const { name, valueBefore, valueAfter } = props;
    return [
      `${' '.repeat(times)}- ${name}: ${mapValue(
        valueBefore,
        times + step,
        step,
      )}`,
      `${' '.repeat(times)}+ ${name}: ${mapValue(
        valueAfter,
        times + step,
        step,
      )}`,
    ].join('\n');
  },
  unchanged: (props, times, step) => {
    const { name, value } = props;
    return `${' '.repeat(times + step)}${name}: ${mapValue(
      value,
      times + step,
      step,
    )}`;
  },
};

export default (ast) => {
  const reduce = (data, times, step) => data.reduce((acc, entry) => {
    const { type, ...props } = entry;
    const buildAcc = typeActions[type];
    const newAcc = [...acc, buildAcc(props, times, step, reduce)];
    return newAcc;
  }, []);
  const result = reduce(ast, 2, 2);
  return `{\n${result.join('\n')}\n}`;
};
