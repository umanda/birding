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
    const english = await screen.findByLabelText('Language: English');
    expect(english.props.accessibilityState.selected).toBe(true);

    fireEvent.press(screen.getByLabelText('Language: සිංහල'));
    expect(await screen.findByText('current:si')).toBeTruthy();
    expect(screen.getByLabelText('භාෂාව: සිංහල').props.accessibilityState.selected).toBe(true);
  });
});
