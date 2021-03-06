import fs from 'fs/promises';
import core from '@actions/core';
import path from 'path';
import { match } from 'path-to-regexp';
import { createGlobber } from './utils.js';

async function uploadFile(httpClient, { project, tags, filePath, locale }) {
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
      tags,
      // The following will tag keys even tho they weren't inserted nor updated.
      // We want to enable this as some keys may be shared across applications.
      tag_skipped_keys: Boolean(tags),
      filename: filePath,
      lang_iso: locale,
      // Lokalise seems to have a problem with their "Universal Placeholders".
      // Lokalise has been notified and they are looking into it.
      // We'll keep our own format for now.
      convert_placeholders: false,
    })
    .then(response => response?.result)
    .catch(error => {
      throw new Error(error?.result?.error?.message ?? 'Unexpected error');
    });
}

export default async function upload(httpClient, localeNormalizer, { project, tags, ...options }) {
  const absolutePath = path.resolve(process.cwd(), options.path);
  const matchPath = match(absolutePath);

  const globber = await createGlobber(absolutePath);

  const uploadedPaths = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const filePath of globber.globGenerator()) {
    const matchedPath = matchPath(filePath);
    if (matchedPath) {
      const locale = await localeNormalizer.normalize(matchedPath.params.locale);

      await uploadFile(httpClient, { project, tags, locale, filePath }).catch(error => {
        core.setFailed({
          title: error.message,
          file: filePath,
        });
      });

      uploadedPaths.push(filePath);
    }
  }

  return uploadedPaths;
}
