import io from '@actions/io';
import { exec } from '@actions/exec';
import { downloadTool } from '@actions/tool-cache';
import { compile, match } from 'path-to-regexp';
import path from 'path';
import { deserializeLocale, createGlobber } from './utils.js';

// Re-implementation of extractZip from @actions/tool-cache to preserve folder structure
async function extractZip(filePath, destinationPath) {
  const unzipPath = await io.which('unzip', true);
  const args = ['-q', '-o'];
  args.push(filePath);

  await exec(`"${unzipPath}"`, args, { cwd: destinationPath });
}

export default async function download(httpClient, options) {
  const toTranslationFilePath = compile(options.path);

  // eslint-disable-next-line no-console
  console.log(`https://api.lokalise.co/api2/projects/${options.project}/files/download`);
  // eslint-disable-next-line no-console
  console.log({
    format: 'po',
    original_filenames: false,
    export_empty_as: 'empty',
    placeholder_format: 'icu',
    bundle_structure: toTranslationFilePath({ locale: '%LANG_ISO%' }),
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

  const rootPath = process.env.GITHUB_WORKSPACE;
  const downloadedPaths = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const sourceFilePath of globber.globGenerator()) {
    const matchedPath = matchTranslationFilePath(sourceFilePath);
    const locale = deserializeLocale(matchedPath.params.locale);
    const destinationFilePath = path.resolve(rootPath, toTranslationFilePath({ locale }));

    await io.mkdirP(path.dirname(destinationFilePath));
    await io.cp(sourceFilePath, destinationFilePath, { recursive: true });

    downloadedPaths.push(destinationFilePath);
  }

  return downloadedPaths;
}
