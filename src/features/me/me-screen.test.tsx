import { renderRouter, screen } from 'expo-router/testing-library';

import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

import { MeScreen } from './me-screen';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <MeScreen />
    </SettingsProvider>
  );
}

describe('MeScreen', () => {
  it('offers the photo credits as a link', async () => {
    await renderRouter({ index: Root });
    const link = screen.getByRole('link', { name: 'Photo credits' });
    expect(link).toHaveProp('href', '/photo-credits');
  });
});
