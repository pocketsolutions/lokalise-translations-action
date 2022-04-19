export default class LokaliseAuthHandler {
  constructor(token) {
    this.token = token;
  }

  prepareRequest(options) {
    // eslint-disable-next-line no-param-reassign
    options.headers['X-Api-Token'] = this.token;
  }

  // This handler cannot handle 401
  // eslint-disable-next-line class-methods-use-this
  canHandleAuthentication() {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  handleAuthentication() {
    return null;
  }
}
