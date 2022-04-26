import glob from '@actions/glob';
import { compile } from 'path-to-regexp';

// eslint-disable-next-line import/prefer-default-export
export function createGlobber(regexpPath) {
  // The validation is not relevant when converting to a glob-pattern.
  const toPath = compile(regexpPath, {
    validate: false,
  });
  const globberPath = toPath({ locale: '*' });

  return glob.create(globberPath);
}
