# Esperanto for FormatJS

This adds Esperanto locale to the FormatJS `Intl` polyfill.

The polyfill already includes Esperanto locales but they're pulled from
Unicode's CLDR repository, which isn't fully translated and therefore includes
some dummy values.

🚨 **Work in Progress**. The current translations include:

- `Intl.RelativeTimeFormat`

## Usage

Simply import the corresponding file from `dist` folder as follows:

```js
// For example, locale for Intl.RelativeTimeFormat
import 'formatjs-esperanto/dist/relativetimeformat.js';
```

## Building

This project uses [yarn](https://classic.yarnpkg.com/en/) so you need to
install it first.

Then execute the following:

```bash
git clone https://github.com/kotwys/formatjs-esperanto.git
cd formatjs-esperanto
yarn
yarn build
```

The locales will appear in the `dist/` folder.
