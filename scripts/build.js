const { outputFile } = require('fs-extra');
const serialize = require('serialize-javascript');
const { minify, transformKeys } = require('./utils.js');
const PluralCompiler = require('make-plural-compiler');

const LOCALE = 'eo';

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

function buildPluralRules() {
  const source = require('./data/pluralrules.json');
  const transform = k => `pluralRule-count-${k}`;
  PluralCompiler.rules = {
    cardinal: {
      [LOCALE]: transformKeys(source.cardinal, transform)
    },
    ordinal: {
      [LOCALE]: transformKeys(source.ordinal, transform)
    }
  };

  const compiler = new PluralCompiler(LOCALE, {
    cardinals: true,
    ordinals: true
  });

  return locale({
    api: 'PluralRules',
    locale: LOCALE,
    data: {
      categories: compiler.categories,
      fn: compiler.compile()
    },
    isJSON: false
  });
}

Promise.all[
  outputFile('dist/relativetimeformat.js', locale({
    api: 'RelativeTimeFormat',
    locale: LOCALE,
    data: require('./data/relativetime.json')
  })),
  outputFile('dist/pluralrules.js', buildPluralRules())
];
