const UglifyJS = require('uglify-js');

/**
 * Minifies JS code.
 *
 * It's an utility function to minify the code with predefined options
 * and error throwing.
 *
 * @param {string} code
 * @throws Will throw an error if the code is incorrect.
 * @returns minified code
 */
module.exports.minify = function (code) {
  const result = UglifyJS.minify(code, {
    output: {
      preamble: '/* @generated */'
    }
  });

  if (result.error)
    throw result.error;

  return result.code;
}

/**
 * Transform all object's keys.
 * 
 * @param {object} object
 * @param {function} transform
 * @returns new object with new keys
 */
module.exports.transformKeys = function (object, transform) {
  return Object.keys(object).reduce((result, key) => {
    result[transform(key)] = object[key];
    return result;
  }, {});
}
