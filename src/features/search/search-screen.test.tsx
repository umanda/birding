import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

import { SearchScreen } from './search-screen';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

async function setup(): Promise<void> {
  await render(
    <SettingsProvider store={createMemoryStore()}>
      <SearchScreen />
    </SettingsProvider>,
  );
}

describe('SearchScreen', () => {
  beforeEach(() => mockPush.mockClear());

  it('shows the hint and a Browse link before typing', async () => {
    await setup();
    expect(await screen.findByText('Type a name in Sinhala, English or Latin')).toBeTruthy();
    await fireEvent.press(screen.getByRole('link', { name: 'Browse plates' }));
    expect(mockPush).toHaveBeenCalledWith('/browse');
  });

  it('lists Sri Lanka Junglefowl first and announces the count', async () => {
    await setup();
    await fireEvent.changeText(
      await screen.findByLabelText('Search birds'),
      'Sri Lanka Junglefowl',
    );
    const rows = within(screen.getByTestId('search-results')).getAllByRole('link');
    expect(rows[0]).toHaveTextContent(/Sri Lanka Junglefowl/);
    expect(screen.getByText(/^\d+ results?$/)).toHaveProp('accessibilityLiveRegion', 'polite');
  });

  it('finds species by Sinhala name and opens the species page', async () => {
    await setup();
    await fireEvent.changeText(await screen.findByLabelText('Search birds'), 'වලි කුකුළා');
    await fireEvent.press(screen.getByRole('link', { name: /Sri Lanka Junglefowl/ }));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/species/[id]',
      params: { id: 'slb-gallus-lafayettii' },
    });
  });

  it('shows a no-match message with a Browse link', async () => {
    await setup();
    await fireEvent.changeText(await screen.findByLabelText('Search birds'), 'zzzzqx');
    expect(screen.getByText('No match for ‘zzzzqx’')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Browse plates' })).toBeTruthy();
  });

  it('clears the query', async () => {
    await setup();
    await fireEvent.changeText(await screen.findByLabelText('Search birds'), 'kite');
    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByText('Type a name in Sinhala, English or Latin')).toBeTruthy();
  });
});
