// Known gap: native Linking.openURL resolves even offline, so the offline notice only shows on
// web until a NetInfo follow-up replaces this.
export function isOnline(): boolean {
  return true;
}
