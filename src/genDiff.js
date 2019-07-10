/* eslint-disable operator-linebreak, lodash/prefer-lodash-method */
import fs from 'fs';
import has from 'lodash/has';

export default (file1, file2) => {
  const obj1 = JSON.parse(fs.readFileSync(file1));
  const obj2 = JSON.parse(fs.readFileSync(file2));

  const result = Object.keys(obj1).reduce((acc, obj1Key) => {
    const [newKey] = Object.keys(obj2).filter(obj2Key => obj2Key !== obj1Key);
    const newKeyValuePair = !has(obj1, newKey)
      ? `  + ${newKey}: ${obj2[newKey]}\n`
      : '';

    if (has(obj2, obj1Key)) {
      const newAcc =
        obj1[obj1Key] === obj2[obj1Key]
          ? [`    ${obj1Key}: ${obj1[obj1Key]}\n`, `${newKeyValuePair}`]
          : [
            `  + ${obj1Key}: ${obj2[obj1Key]}\n`,
            `  - ${obj1Key}: ${obj1[obj1Key]}\n`,
            `${newKeyValuePair}`,
          ];
      return [...acc, ...newAcc];
    }
    return [
      ...acc,
      ...[`  - ${obj1Key}: ${obj1[obj1Key]}\n`, `${newKeyValuePair}`],
    ];
  }, []);
  return `{\n${result.filter(v => v).join('')}}`;
};
