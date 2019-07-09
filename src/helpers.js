/* eslint-disable import/prefer-default-export, implicit-arrow-linebreak */
export const parse = str => `${str.trim().slice(1, str.length - 1)}`.split('\n').filter(v => v).map(v => v.replace(/\s/g, '')).join('');
