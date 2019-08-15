import { sortBy } from 'lodash/fp';

const sortAST = (func = () => {}, data = []) =>
  sortBy(func, data).map((entry) => {
    const { type, name, children } = entry;
    if (type === 'inner') {
      return { type, name, children: sortAST(func, children) };
    }
    return entry;
  });

export default sortAST;
