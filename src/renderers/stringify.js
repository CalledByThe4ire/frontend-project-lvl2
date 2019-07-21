export default (data) => {
  const iter = (obj, factor) => Object.keys(obj).reduce((acc, key) => {
    const newKey = key.match(/^[-+]/) ? key : `${' '.repeat(2)}${key}`;
    const value = obj[key];
    let keyValuePair = '';

    if (value instanceof Object) {
      keyValuePair = `${' '.repeat(2 * factor)}${newKey}: {\n${iter(
        value,
        factor + 2,
      )}${' '.repeat(2 * factor + 2)}}\n`;
      return `${acc}${keyValuePair}`;
    }
    keyValuePair = `${newKey}: ${value}\n`;
    return `${acc}${' '.repeat(2 * factor)}${keyValuePair}`;
  }, '');
  return `{\n${iter(data, 1)}}`;
};
