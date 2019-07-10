/*
eslint-disable import/prefer-default-export,
implicit-arrow-linebreak,
lodash/prefer-lodash-method
*/
export const removeWhitespaces = str => str.trim().replace(/\s/g, '');
export const convertDiffToArray = str => str.slice(str.indexOf('{') + 1, str.indexOf('}')).split('\n').filter(v => v);
