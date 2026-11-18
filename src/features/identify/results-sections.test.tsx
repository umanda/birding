import { render, screen, userEvent } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';

import { MESSAGES, translate } from '@/shared/i18n/translate';
import type { Translate } from '@/shared/i18n/translate';

import { CoverageFooter, NoMatchFooter, ResultsHeader } from './results-sections';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

const t: Translate = (key, vars) => translate(MESSAGES.en, 'en', key, vars);
const SIZE_CHIP = { field: 'size', label: 'Size S' } as const;

describe('ResultsHeader', () => {
  it('shows a live title and the chips, and reports removal', async () => {
    const onRemove = jest.fn();
    await render(
      <ResultsHeader
        title="2 matches"
        chips={[SIZE_CHIP]}
        noMatch={false}
        onRemove={onRemove}
        language="en"
        t={t}
      />,
    );
    expect(screen.getByText('2 matches').props.accessibilityLiveRegion).toBe('polite');
    await userEvent.setup().press(screen.getByRole('button', { name: 'Remove Size S' }));
    expect(onRemove).toHaveBeenCalledWith('size');
    expect(screen.queryByText(/None of the birds/)).toBeNull();
  });

  it('explains when nothing fits and introduces the closest species', async () => {
    await render(
      <ResultsHeader
        title="No close matches"
        chips={[]}
        noMatch
        onRemove={jest.fn()}
        language="en"
        t={t}
      />,
    );
    expect(screen.getByText('None of the birds in this guide fits all your answers.')).toBeTruthy();
    expect(screen.getByText('Closest species')).toBeTruthy();
  });
});

describe('NoMatchFooter', () => {
  it('offers to remove the last answer by name, under a section heading', async () => {
    const onRemove = jest.fn();
    await render(<NoMatchFooter lastChip={SIZE_CHIP} onRemove={onRemove} language="en" t={t} />);
    await userEvent
      .setup()
      .press(screen.getByRole('button', { name: 'Remove last answer (Size S)' }));
    expect(onRemove).toHaveBeenCalledWith('size');
    expect(screen.getByRole('header', { name: 'Not in this guide yet?' })).toBeTruthy();
  });

  it('has no remove button when there is no answer left', async () => {
    await render(<NoMatchFooter lastChip={undefined} onRemove={jest.fn()} language="en" t={t} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('CoverageFooter', () => {
  it('states the coverage and links to Browse and Search', async () => {
    const user = userEvent.setup();
    await renderRouter(
      {
        index: () => <CoverageFooter count={30} total={295} language="en" t={t} />,
        search: () => null,
        browse: () => null,
      },
      { initialUrl: '/' },
    );
    expect(await screen.findByText('This guide can identify 30 of its 295 species')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Browse' })).toBeTruthy();
    await user.press(screen.getByRole('link', { name: 'Search' }));
    expect(screen).toHavePathname('/search');
  });
});
