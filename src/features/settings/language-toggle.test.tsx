import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { createMemoryStore } from '@/test-utils/memory-store';

import { LanguageToggle } from './language-toggle';
import { SettingsProvider, useSettings } from './settings-context';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

function Harness() {
  const { language } = useSettings();
  return (
    <>
      <LanguageToggle />
      <Text>{`current:${language}`}</Text>
    </>
  );
}

describe('LanguageToggle', () => {
  it('marks the current language selected and switches on press', async () => {
    await render(
      <SettingsProvider store={createMemoryStore()}>
        <Harness />
      </SettingsProvider>,
    );
    expect(
      await screen.findByRole('radio', { name: 'Language: English', checked: true }),
    ).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Language: සිංහල'));
    expect(await screen.findByText('current:si')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'භාෂාව: සිංහල', checked: true })).toBeTruthy();
  });
});
