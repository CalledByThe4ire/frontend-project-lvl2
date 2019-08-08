import stringify from './stringify';
import plain from './plain';
import json from './json';

const formatters = {
  stringify,
  plain,
  json,
};

export default format => formatters[format];
