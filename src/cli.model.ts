import { Stats } from 'fs';
import { Transform } from 'stream';

export interface RecursiveCopyCliModel {
  src: string;
  dest: string;
  overwrite?: boolean;
  expand?: boolean;
  dot?: boolean;
  junk?: boolean;
  filter?: (string | RegExp)[];
  renameModule?: string[];
  renamePattern?: string[];
  rename?: RenameFn;
  transformModule?: string[];
  transform?: TransformFn;
  results?: boolean;
  concurrency?: number;
  debug?: boolean;
}

export type RenameFn = (filePath: string) => string;
export type TransformFn = (src: string, dest: string, stats: Stats) => Transform;
