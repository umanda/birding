import { fireEvent, render, screen } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';

import { UPDATE_REGION_TEST_ID, UpdateBanner, UpdateBannerRegion } from './update-banner';

describe('UpdateBanner', () => {
  it('announces the update and reloads only when the button is pressed', async () => {
    const onReload = jest.fn();
    await render(<UpdateBanner language="en" t={createT('en')} onReload={onReload} />);
    expect(screen.getByText('Update available')).toBeTruthy();
    expect(onReload).not.toHaveBeenCalled();

    fireEvent.press(screen.getByRole('button', { name: 'Reload' }));
    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('keeps a polite live region mounted, empty until an update is available', async () => {
    const props = { language: 'en', t: createT('en'), onReload: jest.fn() } as const;
    const { rerender } = await render(<UpdateBannerRegion visible={false} {...props} />);
    const region = screen.getByTestId(UPDATE_REGION_TEST_ID);
    expect(region).toHaveProp('accessibilityLiveRegion', 'polite');
    expect(screen.queryByText('Update available')).toBeNull();

    await rerender(<UpdateBannerRegion visible {...props} />);
    expect(screen.getByTestId(UPDATE_REGION_TEST_ID)).toBe(region);
    expect(screen.getByText('Update available')).toBeTruthy();
  });

  it('is available in Sinhala', async () => {
    await render(<UpdateBanner language="si" t={createT('si')} onReload={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'නැවත පූරණය කරන්න' })).toBeTruthy();
  });
});
