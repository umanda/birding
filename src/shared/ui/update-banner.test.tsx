import { fireEvent, render, screen } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';

import { UpdateBanner } from './update-banner';

describe('UpdateBanner', () => {
  it('announces the update and reloads only when the button is pressed', async () => {
    const onReload = jest.fn();
    await render(<UpdateBanner language="en" t={createT('en')} onReload={onReload} />);
    expect(screen.getByText('Update available')).toBeTruthy();
    expect(onReload).not.toHaveBeenCalled();

    fireEvent.press(screen.getByRole('button', { name: 'Reload' }));
    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('is available in Sinhala', async () => {
    await render(<UpdateBanner language="si" t={createT('si')} onReload={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'නැවත පූරණය කරන්න' })).toBeTruthy();
  });
});
