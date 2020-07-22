const { outputFile } = require('fs-extra');
const serialize = require('serialize-javascript');
const { minify, transformKeys } = require('./utils.js');
const PluralCompiler = require('make-plural-compiler');

/**
 * Creates a locale for `Intl.RelativeTimeFormat`.
 * @returns a string with locale code
 */
function buildRelativeTimeFormat() {
  const data = require('./data/relativetime.json');
  return minify(`
    Intl.RelativeTimeFormat
      && typeof Intl.RelativeTimeFormat.__addLocaleData === 'function'
      && Intl.RelativeTimeFormat.__addLocaleData({
        data: {eo: ${JSON.stringify(data)}}, 
        availableLocales: ["eo"],
        aliases: {},
        parentLocales: {}
      });
  `);
}

/**
 * Creates a locale for `Intl.PluralRules`.
 * @returns a string with locale code
 */
function buildPluralRules() {
  const source = require('./data/pluralrules.json');
  PluralCompiler.rules = {
    cardinal: {
      eo: transformKeys(source.cardinal, k => `pluralRule-count-${k}`)
    },
    ordinal: {
      eo: transformKeys(source.ordinal, k => `pluralRule-count-${k}`)
    }
  };

  const compiler = new PluralCompiler('eo', {
    cardinals: true,
    ordinals: true
  });

  const data = {
    categories: compiler.categories,
    fn: compiler.compile()
  };

  return minify(`
    Intl.PluralRules
      && typeof Intl.PluralRules.__addLocaleData === 'function'
      && Intl.PluralRules.__addLocaleData({
        data: {eo: ${serialize(data)}},
        aliases: {},
        parentLocales: {},
        availableLocales: ["eo"]
      });
  `);
}

Promise.all[
  outputFile('dist/relativetimeformat.js', buildRelativeTimeFormat()),
  outputFile('dist/pluralrules.js', buildPluralRules())
];
