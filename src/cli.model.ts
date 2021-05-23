import type { Stats } from 'fs';
import type { Transform } from 'stream';

export interface RecursiveCopyCliModel {
  src: string;
  dest: string;
  overwrite?: boolean;
  expand?: boolean;
  dot?: boolean;
  junk?: boolean;
  filter?: (RegExp | string)[];
  renameModule?: string[];
  renamePattern?: string[];
  rename?: RenameFn;
  transformModule?: string[];
  transform?: TransformFn;
  concurrency?: number;
  debug?: boolean;
}

export type RenameFn = (filePath: string) => string;
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export type TransformFn = (src: string, dest: string, stats: Stats) => Transform;
