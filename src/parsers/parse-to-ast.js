/* eslint-disable max-len */
import { has } from 'lodash/fp';

/**
 * Проверяет значение ключа для объектов obj1 и jb2.
 * Если значение является типом Object, возвращает true, иначе false
 * @param {string} key
 * @param {Object.<string, *>} obj1
 * @param {Object.<string, *>} obj2
 * @returns {boolean}
 */
const hasChildren = (key, obj1, obj2) =>
  // eslint-disable-next-line
  obj1[key] instanceof Object && obj2[key] instanceof Object;

/**
 * Извлекает объекты из obj1 и obj2 по соответствующему ключу
 * и формирует новый объект на основе переданной функции
 * @param {string} key
 * @param {Object.<string, *>} obj1
 * @param {Object.<string, *>} obj2
 * @param {buildAST} func
 * @returns {Object.<string, *>}
 */
const getChildren = (key, obj1, obj2, func) => {
  if (hasChildren(key, obj1, obj2)) {
    return func(obj1[key], obj2[key]);
  }
  return {};
};

/**
 * Сравнивает объекты obj1 и obj2
 * и возвращает массив ключей obj2,
 * отсутствующих в obj1
 * @param {*} obj1
 * @param {*} obj2
 * @returns {Array.<string>}
 */
const getKeysDifference = (obj1, obj2) =>
  // eslint-disable-next-line
  Object.keys(obj2).filter(key => !Object.keys(obj1).includes(key));

/**
 * Формирует тег типа string, в зависимости от
 * наличия ключа в объектах obj1 и obj2 и их типа и значения,
 * для группировки данных по категориям
 * @param {string} key
 * @param {Object.<string, *>} obj1
 * @param {Object.<string, *>} obj2
 * @returns {string}
 */
const getType = (key, obj1, obj2) => {
  if (has(key, obj1) && !has(key, obj2)) {
    return 'removed';
  }
  if (has(key, obj1) && has(key, obj2)) {
    if (hasChildren(key, obj1, obj2) || obj1[key] === obj2[key]) {
      return 'unchanged';
    }
    if (obj1[key] !== obj2[key]) {
      return 'changed';
    }
  }
  return undefined;
};

/**
 * @typedef {Object} typedObject
 * @prop {string} key
 * @prop {(string\|{before: string, after: string})} [value]
 * @prop {Object.<string, *>} [value]
 */
/**
 * Формирует объект определенной структуры
 * на основе переданных параметров
 * @param { string } type
 * @param { string } key
 * @param { Object.<string, *> } obj1
 * @param { Object.<string, *> } obj2
 * @param {buildAST} func
 * @returns {typedObject}
 */
const createByType = (type, key, obj1, obj2, func) => {
  const children = getChildren(key, obj1, obj2, func);
  switch (type) {
    case 'changed':
      return {
        key,
        value: {
          before: obj1[key],
          after: obj2[key],
        },
      };
    case 'unchanged':
    case 'removed':
      return {
        key,
        ...(Object.keys(children).length === 0 && { value: obj1[key] }),
        ...(Object.keys(children).length !== 0 && { children }),
      };
    default:
      return {};
  }
};

/**
 *@typedef {Object} AST
 * @prop {Array.<typedObject>} added
 * @prop {Array.<typedObject>} unchanged
 * @prop {Array.<typedObject>} changed
 * @prop {Array.<typedObject>} removed
 */
/**
 * Формирует на основе объектов data1 и data2 абстрактное синтаксическое дерево
 * в виде объекта определенной структуры, в которой каждый ключ представлен категорией
 * @param {Object.<string, *>} data1
 * @param {Object.<string, *>} data2
 * @returns {AST}
 */
const buildAST = (data1, data2) => {
  const obj1 = data1;
  const obj2 = data2;

  const root = {
    added: [],
    unchanged: [],
    changed: [],
    removed: [],
  };

  return Object.keys(obj1).reduce((acc, key) => {
    const type = getType(key, obj1, obj2);
    const objByType = createByType(type, key, obj1, obj2, buildAST);
    const newKeys = getKeysDifference(obj1, obj2);
    const newKeyValuePairs = newKeys.map(k => ({ key: k, value: obj2[k] }));
    const newAcc = { ...acc };
    newAcc.added = newAcc.added.length !== 0 ? newAcc.added : newKeyValuePairs;
    newAcc[type].push(objByType);
    return {
      ...acc,
      ...newAcc,
    };
  }, root);
};

export default buildAST;
