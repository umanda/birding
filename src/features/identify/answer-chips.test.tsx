import { render, screen, userEvent } from '@testing-library/react-native';

import { MESSAGES, translate } from '@/shared/i18n/translate';
import type { Translate } from '@/shared/i18n/translate';

import { AnswerChips } from './answer-chips';

const t: Translate = (key, vars) => translate(MESSAGES.en, 'en', key, vars);

describe('AnswerChips', () => {
  it('names each chip by its removal and reports which one was pressed', async () => {
    const onRemove = jest.fn();
    const chips = [
      { field: 'month', label: 'July' },
      { field: 'size', label: 'Size S' },
    ] as const;
    await render(<AnswerChips chips={[...chips]} language="en" t={t} onRemove={onRemove} />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Remove Size S' }));
    expect(onRemove).toHaveBeenCalledWith('size');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
