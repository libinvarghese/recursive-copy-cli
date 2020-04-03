export interface RecursiveCopyCliModel {
  src: string;
  dest: string;
  overwrite?: boolean;
  expand?: boolean;
  dot?: boolean;
  junk?: boolean;
  filterGlob?: string[];
  filterModule?: string;
  filter?: string[] | ((filePath: string) => boolean);
  renameModule?: string[];
  renamePattern?: string[];
  rename?: (filePath: string) => string;
  transformModule?: string;
  transform?: (filePath: string) => string;
  results?: boolean;
  concurrency?: number;
  debug?: boolean;
}
