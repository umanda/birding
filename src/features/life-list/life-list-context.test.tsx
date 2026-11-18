import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { LifeListProvider, useLifeList } from './life-list-context';
import { createMemoryRepository } from './memory-repository';

jest.mock('./open-store', () => ({ openStore: jest.fn() }));

const input = { species_id: 'sp-1', content_version: 'v1', seen_on: '2020-01-02' };

async function setup(open = async () => createMemoryRepository()) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LifeListProvider open={open}>{children}</LifeListProvider>
  );
  const rendered = await renderHook(() => useLifeList(), { wrapper });
  await waitFor(() => expect(rendered.result.current.status).toBe('ready'));
  return rendered;
}

describe('LifeListProvider', () => {
  it('starts loading, then ready on the device store', async () => {
    const { result } = await setup();
    expect(result.current).toMatchObject({ storage: 'device', sightings: [] });
  });

  it('adds, updates, removes and clears sightings, re-reading after each write', async () => {
    const { result } = await setup();
    let id = '';
    await act(async () => {
      id = (await result.current.add(input)).id;
    });
    expect(result.current.sightings).toHaveLength(1);

    await act(async () => {
      await result.current.update(id, { note: 'hello' });
    });
    expect(result.current.sightings[0]?.note).toBe('hello');

    await act(async () => result.current.remove(id));
    expect(result.current.sightings).toHaveLength(0);

    await act(async () => {
      await result.current.add(input);
      await result.current.removeAllUnsynced();
    });
    expect(result.current.sightings).toHaveLength(0);
  });

  it('falls back to memory when the store cannot be opened, and still saves', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = await setup(() => Promise.reject(new Error('blocked')));
    expect(result.current.storage).toBe('memory');
    expect(warn).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.add(input);
    });
    expect(result.current.sightings).toHaveLength(1);
    warn.mockRestore();
  });

  it('throws a clear error outside the provider', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(renderHook(() => useLifeList())).rejects.toThrow(
      'useLifeList must be used inside LifeListProvider',
    );
    error.mockRestore();
  });
});
