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

The available options are:

- **token** `string` - A Lokalise API Token.
- **project** `string` - The Lokalise project id.
- **path** `string` - Path to localizaion (ex. gettext) files. [path-to-regexp](https://github.com/pillarjs/path-to-regexp) expressions are supported where the `:locale` parameter is required. The value of `:locale` is expected to be a valid locale according to [bcp-47](https://en.wikipedia.org/wiki/IETF_language_tag).
- **upload** `boolean?` - Wether to upload files or not. Default is `false`.
- **download** `boolean?` - Wether to download files or not. Default is `false`.

## Testing

The easiest way to test a GitHub Action is to, you guessed it, run it in GitHub. Every pull request you make will run the action twice. Once for uploading translation files and once for downloading them.

## Repository Setup

The following secrets has to be added to GitHub Actions Secrets:

- `LOKALISE_TEST_PROJECT` - The ID of the `GitHub Action` project in Lokalise.
- `LOKALISE_TEST_TOKEN` - A Lokalise API Token with read and write access to the `GitHub Action` project.
