const { outputFile } = require('fs-extra');
const { minify } = require('uglify-js');

const minifyOptions = {
  output: {
    preamble: '/* @generated */'
  }
};

/**
 * Creates a locale for `Intl.RelativeTimeFormat`.
 * @returns a string with locale code
 */
function buildRelativeTimeFormat() {
  const data = require('./data/relativetime.json');
  const result = minify(`
    Intl.RelativeTimeFormat
      && typeof Intl.RelativeTimeFormat.__addLocaleData === 'function'
      && Intl.RelativeTimeFormat.__addLocaleData({
        data: {eo: ${JSON.stringify(data)}}, 
        availableLocales: ["eo"],
        aliases: {},
        parentLocales: {}
      });
  `, minifyOptions);
  
  return result.code;
}

Promise.all[
  outputFile('dist/relativetimeformat.js', buildRelativeTimeFormat())
];
