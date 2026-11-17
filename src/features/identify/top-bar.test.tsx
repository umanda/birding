import { render, screen, userEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { TopBar } from './top-bar';

describe('TopBar', () => {
  it('shows a Back button and its children, and reports presses', async () => {
    const onBack = jest.fn();
    await render(
      <TopBar backLabel="Back" language="en" onBack={onBack}>
        <Text>Month: May</Text>
      </TopBar>,
    );
    expect(screen.getByText('Month: May')).toBeTruthy();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
