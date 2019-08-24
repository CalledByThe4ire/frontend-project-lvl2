import diff from './diff';
import plain from './plain';
import json from './json';

const formatters = {
  diff,
  plain,
  json,
};

export default format => formatters[format];
