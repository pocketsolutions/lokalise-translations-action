import { lookup } from 'bcp-47-match';

function toLowerCaseString(str) {
  return str?.toLowerCase();
}

export default class LocaleNormalizer {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.cache = undefined;
  }

  async getLanguageCodes() {
    if (!this.cache) {
      const response = await this.httpClient.getJson(
        'https://api.lokalise.co/api2/system/languages?limit=5000'
      );

      this.cache = response.result.languages.map(language => language.lang_iso);
    }

    return this.cache;
  }

  async normalize(locale) {
    const tags = await this.getLanguageCodes();
    // Lokalise expects _ (underscore) rather than - (hyphen).
    const range = locale.replace('-', '_');

    return lookup(tags, range);
  }

  async denormalize(locale) {
    const normalizedLocale = await this.normalize(locale);
    if (normalizedLocale) {
      // We expect lower case with - (hyphen) as separator
      return normalizedLocale.split('_').map(toLowerCaseString).join('-');
    }

    return undefined;
  }
}
