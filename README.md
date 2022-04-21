# Lokalise Translations Action

GitHub Action for uploading and downloading translation files to and from Lokalise.

## Usage

**Uploading translations**

The following example demonstrates how to upload translations to Lokalise whenver new code is pushed/merged to the default branch (`main`/`master`).

```yaml
name: Pre Publish
on:
  push:
    branches:
      - main
jobs:
  upload_translations:
    name: Upload Translations to Lokalise
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Upload translations
        uses: pocketsolutions/lokalise-translations-action
        with:
          token: ${{ secrets.LOKALISE_TOKEN }}
          project: ${{ secrets.LOKALISE_PROJECT }}
          path: ./locales/:locale/messages.po
          upload: true
```

**Download translations**

The following example demonstrates how to download translations from Lokalise when a new tag has been pushed.

```yaml
name: Publish
on:
  push:
    tags:
      - "v*"
jobs:
  download_translations:
    name: Download Translations from Lokalise
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Upload translations
        uses: pocketsolutions/lokalise-translations-action
        with:
          token: ${{ secrets.LOKALISE_TOKEN }}
          project: ${{ secrets.LOKALISE_PROJECT }}
          path: ./locales/:locale/messages.po
          download: true
```

### Usage options

- **token** `string` - A Lokalise API Token.
- **project** `string` - The Lokalise project id.
- **path** `string` - Path to localizaion (ex. gettext) files. [path-to-regexp](https://github.com/pillarjs/path-to-regexp) expressions are supported where the `:locale` parameter is required. The value of `:locale` is expected to be a valid locale according to [bcp-47](https://en.wikipedia.org/wiki/IETF_language_tag).
- **upload** `boolean?` - Wether to upload files or not. Default is `false`.
- **download** `boolean?` - Wether to download files or not. Default is `false`.

## Testing

The easiest way to test a GitHub Action is to, you guessed it, run it in GitHub. Follow these steps to test your changes. Every push to a Pull Request will automatically trigger a test for both uploading and downloading. The Pull Request workflow needs two environment secrets:

- `LOKALISE_TEST_TOKEN` - A Lokalise API Token
- `LOKALISE_TEST_PROJECT` - A Lokalise project id

## Release

Follow these steps to make a release:

1. Go to the repoistory.
1. Click on the `Actions` tab.
1. Click on `Publish` in the sidebar.
1. Click on `Run workflow`.
1. Select a Branch. _Only branches configured in `release.config.js` will trigger a release. See the [semantic-release documentation](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#workflow-configuration) for more information._
1. Click on `Run workflow`.
