import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import type { KeyValueStore } from '@/shared/platform/types';
import { createMemoryStore } from '@/test-utils/memory-store';

import { LANGUAGE_STORAGE_KEY, SettingsProvider, useSettings } from './settings-context';

let mockDeviceLanguage = 'en';
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: mockDeviceLanguage }],
}));

async function setup(store: KeyValueStore) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsProvider store={store}>{children}</SettingsProvider>
  );
  return renderHook(() => useSettings(), { wrapper });
}

describe('SettingsProvider', () => {
  beforeEach(() => {
    mockDeviceLanguage = 'en';
  });

  it('uses the device language when nothing is saved', async () => {
    mockDeviceLanguage = 'si';
    const { result } = await setup(createMemoryStore());
    await waitFor(() => expect(result.current.language).toBe('si'));
  });

  it('persists the chosen language', async () => {
    const store = createMemoryStore();
    const { result } = await setup(store);
    await act(() => result.current.setLanguage('si'));
    expect(result.current.language).toBe('si');
    expect(await store.getItem(LANGUAGE_STORAGE_KEY)).toBe('si');
  });

  it('restores the saved language over the device language', async () => {
    const { result } = await setup(createMemoryStore({ [LANGUAGE_STORAGE_KEY]: 'si' }));
    await waitFor(() => expect(result.current.language).toBe('si'));
  });

  it('ignores invalid stored values', async () => {
    mockDeviceLanguage = 'si';
    const { result } = await setup(createMemoryStore({ [LANGUAGE_STORAGE_KEY]: 'xx' }));
    await waitFor(() => expect(result.current.language).toBe('si'));
  });

  it('does not let a late restore overwrite the user choice', async () => {
    let finishRead: (value: string | null) => void = () => undefined;
    const slowStore: KeyValueStore = {
      getItem: () => new Promise((resolve) => (finishRead = resolve)),
      setItem: () => Promise.resolve(),
    };
    const { result } = await setup(slowStore);
    await act(() => result.current.setLanguage('en'));
    await act(async () => finishRead('si'));
    expect(result.current.language).toBe('en');
  });

  it('survives a failing store', async () => {
    const failing: KeyValueStore = {
      getItem: () => Promise.reject(new Error('boom')),
      setItem: () => Promise.reject(new Error('boom')),
    };
    const { result } = await setup(failing);
    await act(() => result.current.setLanguage('si'));
    expect(result.current.language).toBe('si');
  });
});
