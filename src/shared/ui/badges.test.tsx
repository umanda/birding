import { render, screen } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';

import { IucnBadge } from './iucn-badge';
import { OccurrenceBadge } from './occurrence-badge';

const t = createT('en');

describe('OccurrenceBadge', () => {
  it.each([
    ['E', '● E Endemic', 'E Endemic'],
    ['R', '▲ R Resident', 'R Resident'],
    ['M', '◆ M Migrant', 'M Migrant'],
  ] as const)('shows shape, letter and word for %s', async (code, text, label) => {
    await render(<OccurrenceBadge code={code} language="en" t={t} />);
    expect(screen.getByText(text)).toBeTruthy();
    expect(screen.getByLabelText(label)).toBeTruthy();
  });

  it('shows the exact compound code', async () => {
    await render(<OccurrenceBadge code="R+(M)" language="en" t={t} />);
    expect(screen.getByText('■ R+(M) Resident + Migrant')).toBeTruthy();
  });

  it('uses the Sinhala font and its own line height, letting the long label wrap', async () => {
    await render(<OccurrenceBadge code="R" language="si" t={createT('si')} />);
    const text = screen.getByText('▲ R ශ්‍රී ලංකාවේ නිතිපතා වාසය කරන');
    expect(text.props.numberOfLines).toBeUndefined();
    expect(text).toHaveStyle({ fontFamily: 'NotoSansSinhala_700Bold', lineHeight: 14 * 1.6 });
  });
});

describe('IucnBadge', () => {
  it('shows the code and labels it with the full name', async () => {
    await render(<IucnBadge category="LC" language="en" t={t} />);
    expect(screen.getByText('LC')).toBeTruthy();
    expect(screen.getByLabelText('Global status (working value): Least Concern')).toBeTruthy();
  });
});
