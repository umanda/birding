import { userEvent } from '@testing-library/react-native';
import { Slot } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';

import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

import { currentMonth } from './answers-params';
import { IdentifyHome } from './identify-home';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Slot />
    </SettingsProvider>
  );
}

describe('IdentifyHome', () => {
  it('opens the first question from the Step-by-step ID button', async () => {
    const user = userEvent.setup();
    await renderRouter(
      { _layout: Root, index: IdentifyHome, 'identify/[step]': () => null },
      { initialUrl: '/' },
    );
    await user.press(await screen.findByRole('button', { name: 'Step-by-step ID' }));
    expect(screen).toHavePathname('/identify/zone');
    expect(screen).toHaveSearchParams({ step: 'zone', month: String(currentMonth()) });
  });
});
