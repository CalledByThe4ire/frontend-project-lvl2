import common from './common';
import plain from './plain';
import json from './json';

const formatters = {
  common,
  plain,
  json,
};

export default format => formatters[format];
