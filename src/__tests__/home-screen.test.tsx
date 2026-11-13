import { renderRouter, screen } from 'expo-router/testing-library';

import HomeScreen from '@/app/index';

describe('HomeScreen', () => {
  it('shows the app title', async () => {
    await renderRouter({ index: HomeScreen });
    expect(screen.getByText('Sri Lanka Birds')).toBeTruthy();
  });
});
