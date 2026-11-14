import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';

import type { SpeciesSource } from '@/shared/data/species-text-schema';
import { createT } from '@/shared/i18n/translate';
import { isOnline } from '@/shared/platform/is-online';

import { SpeciesSources } from './species-sources';

jest.mock('@/shared/platform/is-online', () => ({ isOnline: jest.fn(() => true) }));

const NOTE = 'Not independently revalidated in database export';
const source = (id: string, links: string[]): SpeciesSource => ({
  source_id: id,
  citation: `Citation ${id}`,
  links,
  type: null,
  verification_note: NOTE,
});
const t = createT('en');
const sources = [
  source('a', ['https://www.ceylonbirdclub.org/list.pdf', 'https://app.limosa.online/x']),
  source('b', []),
];

describe('SpeciesSources', () => {
  const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue();
  beforeEach(() => {
    openURL.mockClear();
    jest.mocked(isOnline).mockReturnValue(true);
  });

  it('lists citations verbatim, links by domain and the shared note once', async () => {
    await render(<SpeciesSources sources={sources} language="en" t={t} />);
    expect(screen.getByRole('header', { name: 'Sources' })).toHaveProp('aria-level', 2);
    expect(screen.getByText('Citation a')).toBeTruthy();
    expect(screen.getByText('Citation b')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'www.ceylonbirdclub.org' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'app.limosa.online' })).toBeTruthy();
    expect(screen.getAllByText(`Verification: ${NOTE}`)).toHaveLength(1);
  });

  it('reads Not recorded when there are no sources', async () => {
    await render(<SpeciesSources sources={[]} language="en" t={t} />);
    expect(screen.getByText('Not recorded')).toBeTruthy();
  });

  it('opens a link when online', async () => {
    await render(<SpeciesSources sources={sources} language="en" t={t} />);
    await fireEvent.press(screen.getByRole('link', { name: 'app.limosa.online' }));
    expect(openURL).toHaveBeenCalledWith('https://app.limosa.online/x');
    expect(screen.queryByText(/You're offline/)).toBeNull();
  });

  it('shows an inline notice instead of opening when offline', async () => {
    jest.mocked(isOnline).mockReturnValue(false);
    await render(<SpeciesSources sources={sources} language="en" t={t} />);
    await fireEvent.press(screen.getByRole('link', { name: 'app.limosa.online' }));
    expect(openURL).not.toHaveBeenCalled();
    expect(screen.getByText("You're offline — links open when you're back online.")).toBeTruthy();
  });

  it('shows the notice when opening the link fails', async () => {
    openURL.mockRejectedValueOnce(new Error('no network'));
    await render(<SpeciesSources sources={sources} language="en" t={t} />);
    await fireEvent.press(screen.getByRole('link', { name: 'app.limosa.online' }));
    expect(await screen.findByText(/You're offline/)).toBeTruthy();
  });

  it('keeps a non-web link as plain text', async () => {
    const odd = [source('c', ['javascript:alert(1)'])];
    await render(<SpeciesSources sources={odd} language="en" t={t} />);
    expect(screen.getByText('javascript:alert(1)')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('shows the notice in the UI language', async () => {
    jest.mocked(isOnline).mockReturnValue(false);
    await render(<SpeciesSources sources={sources} language="si" t={createT('si')} />);
    await fireEvent.press(screen.getByRole('link', { name: 'app.limosa.online' }));
    expect(screen.getByText(/ඔබ නොබැඳි ය/)).toBeTruthy();
  });
});
