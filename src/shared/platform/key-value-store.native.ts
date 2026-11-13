import Storage from 'expo-sqlite/kv-store';

import type { KeyValueStore } from './types';

// SQLite is already planned for content (ADR 0003), so no AsyncStorage dependency.
export const keyValueStore: KeyValueStore = Storage;
