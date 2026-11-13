import { render, screen } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';

import { IucnBadge } from './iucn-badge';
import { OccurrenceBadge } from './occurrence-badge';

const t = createT('en');

describe('OccurrenceBadge', () => {
  it.each([
    ['E', '● E Endemic'],
    ['R', '▲ R Resident'],
    ['M', '◆ M Migrant'],
  ] as const)('shows shape, letter and word for %s', async (code, text) => {
    await render(<OccurrenceBadge code={code} t={t} />);
    expect(screen.getByText(text)).toBeTruthy();
    expect(screen.getByLabelText(text.slice(2))).toBeTruthy();
  });

  it('shows the exact compound code', async () => {
    await render(<OccurrenceBadge code="R+(M)" t={t} />);
    expect(screen.getByText('■ R+(M) Resident + Migrant')).toBeTruthy();
  });
});

describe('IucnBadge', () => {
  it('shows the code with an accessible label', async () => {
    await render(<IucnBadge category="LC" label="Global status (working value)" />);
    expect(screen.getByText('LC')).toBeTruthy();
    expect(screen.getByLabelText('Global status (working value): LC')).toBeTruthy();
  });
});
