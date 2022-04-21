import { HttpClient } from '@actions/http-client';
import core from '@actions/core';
import LokaliseAuthHandler from './lib/LokaliseAuthHandler.js';
import upload from './upload.js';
import download from './download.js';

function newLineList(list) {
  return list.filter(item => item !== '').join('\n');
}

/**
 * GitHub Action
 * @param {Object} options - Action configuration options
 * @param {string} options.token - Lokalise API Token
 * @param {string} options.project - Lokalise Project ID
 * @param {string} options.path - Path to translation file(s)
 * @param {boolean} options.upload - Defines if we should upload files
 * @param {boolean} options.download - Defines if we should download filess
 */
export default async function action(options) {
  const authHandler = new LokaliseAuthHandler(options.token);
  const httpClient = new HttpClient('translate-action', [authHandler]);

  try {
    if (options.upload) {
      core.debug('upload: true');
      const uploadedPaths = await upload(httpClient, options);
      core.setOutput('uploads', newLineList(uploadedPaths));
    }

    if (options.download) {
      core.debug('download: true');
      const downloadedPaths = await download(httpClient, options);
      core.setOutput('downloads', newLineList(downloadedPaths));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
