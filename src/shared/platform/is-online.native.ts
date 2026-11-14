// Without a NetInfo dependency the device cannot tell; opening the link simply fails when offline.
export function isOnline(): boolean {
  return true;
}
