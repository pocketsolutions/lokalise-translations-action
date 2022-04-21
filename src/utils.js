import core from '@actions/core';
import glob from '@actions/glob';
import { bcp47Normalize } from 'bcp-47-normalize';
import { compile } from 'path-to-regexp';

export function createGlobber(regexpPath) {
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

export function serializeLocale(locale) {
  const normalizedLocale = normalizeLocale(locale);

  // Lokalise expects _ (underscore) rather than hyphen (-).
  return normalizedLocale?.replace('-', '_');
}

export function deserializeLocale(locale) {
  // Lokalise provides _ (underscore) rather than expected hyphen (-).
  const normalizedLocale = normalizeLocale(locale.replace('_', '-'));

  // We expect lower-case
  return normalizedLocale.toLowerCase();
}
