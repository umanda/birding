import type { SpeciesTextFile, TextField, TextValue } from './species-text-schema';

export type SpeciesText = Record<TextField, TextValue>;

let fileLoad: Promise<SpeciesTextFile> | null = null;

// A dynamic import keeps the ~185 KB gz prose out of the entry bundle. The promise is cached so
// the file loads once; a failed load is dropped so the next call can retry.
function loadFile(): Promise<SpeciesTextFile> {
  fileLoad ??= import('../../../content/species-text.json').then(
    (module) => module.default as SpeciesTextFile,
    (error: unknown) => {
      fileLoad = null;
      throw error;
    },
  );
  return fileLoad;
}

export async function getSpeciesText(speciesId: string): Promise<SpeciesText | undefined> {
  const file = await loadFile();
  return file.species[speciesId];
}
