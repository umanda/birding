// Web: the browser's own flag. is-online.native.ts overrides it on devices.
export function isOnline(): boolean {
  return navigator.onLine;
}
