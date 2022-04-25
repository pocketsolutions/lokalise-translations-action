import io from '@actions/io';
import { exec } from '@actions/exec';
import { downloadTool } from '@actions/tool-cache';
import { compile, match } from 'path-to-regexp';
import path from 'path';
import { createGlobber } from './utils.js';

// Re-implementation of extractZip from @actions/tool-cache to preserve folder structure
async function extractZip(filePath, destinationPath) {
  const unzipPath = await io.which('unzip', true);
  const args = ['-q', '-o'];
  args.push(filePath);

  await exec(`"${unzipPath}"`, args, { cwd: destinationPath });
}

export default async function download(httpClient, localeNormalizer, options) {
  const toTranslationFilePath = compile(options.path, {
    validate: false,
  });

  const response = await httpClient.postJson(
    `https://api.lokalise.co/api2/projects/${options.project}/files/download`,
    {
      format: 'po',
      original_filenames: false,
      export_empty_as: 'empty',
      placeholder_format: 'icu',
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
    if (matchedPath) {
      const locale = await localeNormalizer.denormalize(matchedPath.params.locale);
      const destinationFilePath = toTranslationFilePath({ locale });

      await io.mkdirP(path.dirname(destinationFilePath));
      await io.cp(sourceFilePath, destinationFilePath, { recursive: true });

      downloadedPaths.push(destinationFilePath);
    }
  }

  return downloadedPaths;
}
