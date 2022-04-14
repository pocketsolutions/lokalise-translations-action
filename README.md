# Lokalise Translations Action

GitHub Action for uploading and downloading translation files to and from Lokalise.

## Testing

The easiest way to test a GitHub Action is to, you guessed it, run it in GitHub. Every pull request you make will run the action twice. Once for uploading translation files and once for downloading them.

## Repository Setup

The following secrets has to be added to GitHub Actions Secrets:

- `LOKALISE_TEST_PROJECT` - The ID of the `GitHub Action` project in Lokalise.
- `LOKALISE_TEST_TOKEN` - A Lokalise API Token with read and write access to the `GitHub Action` project.
