import core from '@actions/core';
import { parse } from 'path-to-regexp';
import action from './action.js';

const IS_WINDOWS = process.platform === 'win32';

function isValidPath(format) {
  const tokens = parse(format);

  function isLocaleToken(token) {
    return token.name === 'locale';
  }

  return tokens.some(isLocaleToken);
}

(async function main() {
  const token = core.getInput('token', { required: true });
  const project = core.getInput('project', { required: true });
  const path = core.getInput('path', { required: true });
  const upload = core.getBooleanInput('upload', { required: false });
  const download = core.getBooleanInput('download', { required: false });

  try {
    if (!isValidPath(path)) {
      throw new Error(`\`path\` must include a :locale parameter.`);
    }

    if (download && IS_WINDOWS) {
      throw new Error('Cannot download files on windows due to complicated unzip.');
    }

    await action({ token, project, path, upload, download });
  } catch (error) {
    core.setFailed(error.message);
  }
})();
