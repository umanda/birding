import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { SettingsProvider } from '@/features/settings';
import { isOnline } from '@/shared/platform/is-online';
import type { PhotoPack } from '@/shared/platform/photo-pack';
import { fixtureImage } from '@/test-utils/media-fixture';
import { createMemoryStore } from '@/test-utils/memory-store';

import { PhotoPackSection } from './photo-pack-section';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));
jest.mock('@/shared/platform/is-online', () => ({ isOnline: jest.fn(() => true) }));

const images = [
  fixtureImage({
    image_id: 'a',
    full: { ...fixtureImage().full, path: 'media/a.webp', bytes: 1024 * 1024 },
  }),
  fixtureImage({
    image_id: 'b',
    full: { ...fixtureImage().full, path: 'media/b.webp', bytes: 1024 * 1024 },
  }),
];

function fakePack(overrides: Partial<PhotoPack> = {}, cached: string[] = []): PhotoPack {
  return {
    isSupported: () => true,
    listCachedUrls: async () => new Set(cached),
    download: async (_urls, { onProgress }) => {
      onProgress(1);
      return 'done';
    },
    ...overrides,
  };
}

async function renderSection(downloader: PhotoPack, list = images): Promise<void> {
  await render(
    <SettingsProvider store={createMemoryStore()}>
      <PhotoPackSection downloader={downloader} images={list} />
    </SettingsProvider>,
  );
}

describe('PhotoPackSection', () => {
  beforeEach(() => jest.mocked(isOnline).mockReturnValue(true));

  it('shows size, Wi-Fi hint and progress before downloading', async () => {
    await renderSection(fakePack({}, ['/media/a.webp']));
    expect(await screen.findByText('2.0 MB, 2 photos')).toBeTruthy();
    expect(screen.getByText('Best on Wi-Fi')).toBeTruthy();
    expect(await screen.findByText('1 of 2')).toBeTruthy();
  });

  it('downloads the remaining photos and reports completion', async () => {
    const download = jest.fn(fakePack().download);
    await renderSection(fakePack({ download }));
    fireEvent.press(await screen.findByRole('button', { name: 'Download' }));
    await waitFor(() => expect(download).toHaveBeenCalled());
    expect(download.mock.calls[0]?.[0]).toEqual(['/media/a.webp', '/media/b.webp']);
  });

  it('shows the done state when everything is saved', async () => {
    await renderSection(fakePack({}, ['/media/a.webp', '/media/b.webp']));
    expect(await screen.findByText('All photos saved for offline use')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('offers cancel while running and resume after an interruption', async () => {
    let finish: (result: 'interrupted') => void = () => undefined;
    const download = (): Promise<'interrupted'> => new Promise((resolve) => (finish = resolve));
    await renderSection(fakePack({ download }));
    fireEvent.press(await screen.findByRole('button', { name: 'Download' }));
    expect(await screen.findByRole('button', { name: 'Cancel' })).toBeTruthy();
    finish('interrupted');
    expect(await screen.findByText('Download stopped. Press Download to resume.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
  });

  it('disables download with a note when offline', async () => {
    jest.mocked(isOnline).mockReturnValue(false);
    await renderSection(fakePack());
    expect(await screen.findByText('You are offline. Connect to download.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
  });

  it('says the pack is web-only when unsupported', async () => {
    await renderSection(fakePack({ isSupported: () => false }));
    expect(await screen.findByText('Available in the web app for now')).toBeTruthy();
  });

  it('says there are no photos for an empty manifest', async () => {
    await renderSection(fakePack(), []);
    expect(await screen.findByText('No photos yet')).toBeTruthy();
  });
});
