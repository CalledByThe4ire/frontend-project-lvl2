import stringify from './stringify';
import plain from './plain';
import json from './json';

const formatters = {
  stringify,
  plain,
  json,
};

export default (format, data) => {
  const formatter = formatters[format];
  return formatter(data);
};
