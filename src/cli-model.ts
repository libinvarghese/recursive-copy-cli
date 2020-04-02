export interface RecursiveCopyCliModel {
  src: string;
  dest: string;
  overwrite?: boolean;
  expand?: boolean;
  dot?: boolean;
  junk?: boolean;
  filterRegEx?: string[];
  filterGlob?: string[];
  filterModule?: string;
  filter?: string[] | ((filePath: string) => boolean);
  renameModule?: string;
  renamePattern?: string;
  renameRegexp?: string;
  renameSubstitute?: string;
  rename?: (filePath: string) => string;
  transformModule?: string;
  transform?: (filePath: string) => string;
  results?: boolean;
  concurrency?: number;
  debug?: boolean;
}
