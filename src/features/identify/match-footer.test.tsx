import { render, screen, userEvent } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';

import { MatchFooter } from './match-footer';

const t = createT('en');

describe('MatchFooter', () => {
  it.each([
    [1, 'See 1 match'],
    [12, 'See 12 matches'],
    [0, 'No close matches'],
  ])('with %i matches reads "%s", announced politely', async (count, text) => {
    await render(<MatchFooter count={count} language="en" t={t} onPress={jest.fn()} />);
    expect(screen.getByText(text).props.accessibilityLiveRegion).toBe('polite');
  });

  it('reports presses', async () => {
    const onPress = jest.fn();
    await render(<MatchFooter count={3} language="en" t={t} onPress={onPress} />);
    await userEvent.setup().press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
