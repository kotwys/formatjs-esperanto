const { outputFile } = require('fs-extra');
const serialize = require('serialize-javascript');
const { minify, transformKeys } = require('./utils.js');
const PluralCompiler = require('make-plural-compiler');

/**
 * Parameters object for `locale` function.
 *
 * @typedef {Object} LocaleParams
 * @property {string} api - Intl's API to create locale for
 * @property {string} locale - code of the locale
 * @property {object} data
 * @property {boolean} [isJSON] - whether the data is JSON-compatible. true by default
 */

/**
 * Creates locale file with specified data.
 *
 * @param {LocaleParams} props
 * @returns a string with locale code
 */
function locale(props) {
  props.isJSON = props.isJSON == undefined ? true : props.isJSON;
  const { api, locale, data, isJSON } = props;
  const serializedData = serialize(data, { isJSON });
  return minify(`
    Intl.${api}
      && typeof Intl.${api}.__addLocaleData === 'function'
      && Intl.${api}.__addLocaleData({
        data: { ${locale}: ${serializedData} },
        availableLocales: ["${locale}"],
        aliases: {},
        parentLocales: {}
      });
  `);
}

function buildRelativeTimeFormat() {
  const data = require('./data/relativetime.json');
  return locale({
    api: 'RelativeTimeFormat',
    locale: 'eo',
    data
  });
}

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

  return locale({
    api: 'PluralRules',
    locale: 'eo',
    data,
    isJSON: false
  });
}

Promise.all[
  outputFile('dist/relativetimeformat.js', buildRelativeTimeFormat()),
  outputFile('dist/pluralrules.js', buildPluralRules())
];
