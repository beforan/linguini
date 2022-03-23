// This is pretty close to a generic object flattener
// but it's only designed with our language files in mind
// i.e. values are either objects or strings, nothing else.

import { isPlainObject } from "lodash-es";

/**
 * Flatten a language object to a flat object
 * with lodash path style keys and string values
 * @param {*} lng
 * @returns
 */
export const flattenLanguage = (lng) => {
  const reducer = (a, k) => {
    const newPath = a.path ? `${a.path}.${k}` : k;
    if (isPlainObject(a.o[k])) {
      iteratee(newPath, a.o[k], a.result);
    } else {
      a.result[newPath] = a.o[k];
    }
    return a;
  };

  const iteratee = (path, o, result) => {
    return Object.keys(o).reduce(reducer, { path, result, o });
  };

  const { result } = iteratee("", lng, {});
  return result;
};
