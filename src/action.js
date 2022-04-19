import { HttpClient } from '@actions/http-client';
import fs from 'fs/promises';
import path from 'path';
import core from '@actions/core';
import glob from '@actions/glob';
import io from '@actions/io';
import { exec } from '@actions/exec';
import { downloadTool } from '@actions/tool-cache';
import { bcp47Normalize } from 'bcp-47-normalize';
import { match, compile } from 'path-to-regexp';
import LokaliseAuthHandler from './lib/LokaliseAuthHandler.js';

function createGlobber(regexpPath) {
  const toPath = compile(regexpPath);
  const globberPath = toPath({ locale: '*' });

  return glob.create(globberPath);
}

function normalizeLocale(locale) {
  return bcp47Normalize(locale, {
    forgiving: false,
    warning: reason => core.warning(reason),
  });
}

function serializeLocale(locale) {
  const normalizedLocale = normalizeLocale(locale);

  // Lokalise expects _ (underscore) rather than hyphen (-).
  return normalizedLocale?.replace('-', '_');
}

function deserializeLocale(locale) {
  // Lokalise provides _ (underscore) rather than expected hyphen (-).
  const normalizedLocale = normalizeLocale(locale.replace('_', '-'));

  // We expect lower-case
  return normalizedLocale.toLowerCase();
}

async function uploadFile(httpClient, { project, filePath, ...options }) {
  const locale = serializeLocale(options.locale);

  if (!locale) {
    core.warning({
      title: 'Unable to extract locale from path',
      file: filePath,
    });

    return undefined;
  }

  const data = await fs.readFile(filePath, { encoding: 'base64' });

  return httpClient
    .postJson(`https://api.lokalise.co/api2/projects/${project}/files/upload`, {
      data,
      filename: filePath,
      lang_iso: locale,
    })
    .then(response => response?.result)
    .catch(error => {
      throw new Error(error?.result?.error?.message ?? 'Unexpected error');
    });
}

async function upload(httpClient, { project, ...options }) {
  const absolutePath = path.resolve(process.cwd(), options.path);
  const matchPath = match(absolutePath);

  const globber = await createGlobber(absolutePath);

  const uploadedPaths = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const filePath of globber.globGenerator()) {
    const matchedPath = matchPath(filePath);
    const { locale } = matchedPath.params;

    await uploadFile(httpClient, { project, locale, filePath }).catch(error => {
      core.setFailed({
        title: error.message,
        file: filePath,
      });
    });

    uploadedPaths.push(filePath);
  }

  return uploadedPaths;
}

// Re-implementation of extractZip from @actions/tool-cache to preserve folder structure
async function extractZip(filePath, destinationPath) {
  const unzipPath = await io.which('unzip', true);
  const args = ['-q', '-o'];
  args.push(filePath);

  await exec(`"${unzipPath}"`, args, { cwd: destinationPath });
}

async function download(httpClient, options) {
  const toTranslationFilePath = compile(options.path);

  const response = await httpClient.postJson(
    `https://api.lokalise.co/api2/projects/${options.project}/files/download`,
    {
      format: 'po',
      original_filenames: false,
      bundle_structure: toTranslationFilePath({ locale: '%LANG_ISO%' }),
    }
  );

  const downloadUrl = response.result.bundle_url;
  const relativeZipPath = await downloadTool(downloadUrl);
  const absoluteZipPath = path.resolve(relativeZipPath);
  const extractedFromZipPath = path.dirname(absoluteZipPath);

  await extractZip(absoluteZipPath, extractedFromZipPath);

  const tmpTranslationsPath = path.join(extractedFromZipPath, options.path);
  const matchTranslationFilePath = match(tmpTranslationsPath);
  const globber = await createGlobber(tmpTranslationsPath);

  const downloadedPaths = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const sourceFilePath of globber.globGenerator()) {
    const matchedPath = matchTranslationFilePath(sourceFilePath);
    const locale = deserializeLocale(matchedPath.params.locale);
    const destinationFilePath = toTranslationFilePath({ locale });

    await io.mkdirP(path.dirname(destinationFilePath));
    await io.cp(sourceFilePath, destinationFilePath, { recursive: true });

    downloadedPaths.push(destinationFilePath);
  }

  return downloadedPaths;
}

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
