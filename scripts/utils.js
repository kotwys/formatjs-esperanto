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
