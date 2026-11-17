import { render, screen, userEvent } from '@testing-library/react-native';

import type { Month } from '@/shared/data/traits-vocabulary';
import { createT } from '@/shared/i18n/translate';

import { MonthPicker } from './month-picker';

const t = createT('en');

async function setup(month: Month | undefined) {
  const onOpen = jest.fn();
  const onPick = jest.fn();
  await render(<MonthPicker month={month} language="en" t={t} onOpen={onOpen} onPick={onPick} />);
  return { onOpen, onPick, user: userEvent.setup() };
}

describe('MonthPicker', () => {
  it('shows the chip and opens the sheet with the month selected', async () => {
    const { onOpen, user } = await setup(5);
    await user.press(screen.getByRole('button', { name: 'Month: May' }));
    expect(onOpen).toHaveBeenCalled();
    expect(screen.getAllByRole('radio')).toHaveLength(13);
    expect(screen.getByRole('radio', { name: 'May', checked: true })).toBeTruthy();
  });

  it('picks a month and closes', async () => {
    const { onPick, user } = await setup(5);
    await user.press(screen.getByRole('button', { name: 'Month: May' }));
    await user.press(screen.getByRole('radio', { name: 'March' }));
    expect(onPick).toHaveBeenCalledWith(3);
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('picks Any month', async () => {
    const { onPick, user } = await setup(5);
    await user.press(screen.getByRole('button', { name: 'Month: May' }));
    await user.press(screen.getByRole('radio', { name: 'Any month' }));
    expect(onPick).toHaveBeenCalledWith(undefined);
  });

  it('closes from the backdrop without picking', async () => {
    const { onPick, user } = await setup(5);
    await user.press(screen.getByRole('button', { name: 'Month: May' }));
    await user.press(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(onPick).not.toHaveBeenCalled();
  });

  it('labels the chip Any month when no month is chosen', async () => {
    await setup(undefined);
    expect(screen.getByRole('button', { name: 'Month: Any month' })).toBeTruthy();
  });
});
