import { act, userEvent } from '@testing-library/react-native';
import { Slot } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';

import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

import type { SpeciesTraits } from '@/shared/data/traits';

import { QuestionScreen } from './question-screen';
import { FIXTURE_TRAITS } from './test-traits.fixture';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

// Wraps the real router so tests can see whether the screen navigated.
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    useRouter: () => {
      const router = actual.useRouter();
      return {
        ...router,
        replace: (...args: unknown[]) => (mockReplace(...args), router.replace(...args)),
        push: (...args: unknown[]) => (mockPush(...args), router.push(...args)),
      };
    },
  };
});

const ADVANCE_MS = 300;

function Root(): React.JSX.Element {
  return (
    <SettingsProvider store={createMemoryStore()}>
      <Slot />
    </SettingsProvider>
  );
}

const routesFor = (traits: SpeciesTraits[]) => ({
  _layout: Root,
  index: () => null,
  'identify/[step]': () => <QuestionScreen traits={traits} />,
  'identify/results': () => null,
});

type User = ReturnType<typeof userEvent.setup>;

async function open(url: string, traits = FIXTURE_TRAITS): Promise<User> {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await renderRouter(routesFor(traits), { initialUrl: url });
  return user;
}

const advance = (): Promise<void> =>
  act(async () => {
    jest.advanceTimersByTime(ADVANCE_MS);
  });

beforeEach(() => {
  mockReplace.mockClear();
  mockPush.mockClear();
  jest.useFakeTimers();
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('QuestionScreen', () => {
  it('shows the question, its answers, Not sure and a live match count', async () => {
    await open('/identify/zone?month=5');
    expect(await screen.findByText('Where in Sri Lanka?')).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(7);
    expect(screen.getByRole('radio', { name: 'Not sure' })).toBeTruthy();
    expect(screen.getByText('See 2 matches').props.accessibilityLiveRegion).toBe('polite');
  });

  it('selects an answer, updates the count and moves on after the delay', async () => {
    const user = await open('/identify/zone?month=5');
    await user.press(await screen.findByRole('radio', { name: /^Wet lowlands/ }));
    expect(screen.getByRole('radio', { name: /^Wet lowlands/, checked: true })).toBeTruthy();
    expect(screen.getByText('See 1 match')).toBeTruthy();
    await advance();
    expect(await screen.findByText('What was the habitat?')).toBeTruthy();
    expect(screen).toHaveSearchParams({ step: 'habitat', month: '5', zone: 'wet_lowland' });
  });

  it('Not sure clears an earlier answer before advancing', async () => {
    const user = await open('/identify/habitat?month=5&zone=montane&habitat=forest');
    await user.press(await screen.findByRole('radio', { name: 'Not sure' }));
    expect(screen).toHaveSearchParams({ step: 'habitat', month: '5', zone: 'montane' });
    await advance();
    expect(await screen.findByText('How big was it?')).toBeTruthy();
    expect(screen).toHaveSearchParams({ step: 'size', month: '5', zone: 'montane' });
  });

  it('opens the results after the last question', async () => {
    const user = await open('/identify/behaviour?month=5');
    await user.press(await screen.findByRole('radio', { name: 'Swimming' }));
    await advance();
    expect(screen).toHavePathname('/identify/results');
    expect(screen).toHaveSearchParams({ month: '5', behaviour: 'swimming' });
  });

  it('does not navigate after the screen is gone', async () => {
    const user = await open('/identify/zone?month=5');
    await user.press(await screen.findByRole('radio', { name: /^Montane/ }));
    await screen.unmount();
    await advance();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('Back shows the previous question with the earlier answer selected', async () => {
    const user = await open('/identify/habitat?month=5&zone=montane');
    await user.press(await screen.findByRole('button', { name: 'Back' }));
    expect(await screen.findByText('Where in Sri Lanka?')).toBeTruthy();
    expect(screen.getByRole('radio', { name: /^Montane/, checked: true })).toBeTruthy();
  });

  it('Back on the first question leaves the flow', async () => {
    const user = await open('/identify/zone?month=5');
    await user.press(await screen.findByRole('button', { name: 'Back' }));
    expect(screen).toHavePathname('/');
  });

  it('cancels the pending advance when Back is pressed', async () => {
    const user = await open('/identify/habitat?month=5&zone=montane');
    await user.press(await screen.findByRole('radio', { name: 'Forest' }));
    await user.press(screen.getByRole('button', { name: 'Back' }));
    await advance();
    expect(mockReplace).toHaveBeenCalledTimes(1); // Back only, never the advance
    expect(screen).toHavePathname('/identify/zone');
  });

  it('cancels the pending advance when See matches is pressed', async () => {
    const user = await open('/identify/zone?month=5');
    await user.press(await screen.findByRole('radio', { name: /^Montane/ }));
    await user.press(screen.getByText('See 1 match'));
    await advance();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(screen).toHavePathname('/identify/results');
  });

  it('says "No close matches" when no species match', async () => {
    await open('/identify/zone?month=5', []);
    expect(await screen.findByText('No close matches')).toBeTruthy();
  });

  it('sends an unknown step back home', async () => {
    await open('/identify/bogus');
    expect(screen).toHavePathname('/');
  });

  it('Any month in the sheet sets month=any and keeps the answers', async () => {
    const user = await open('/identify/habitat?month=5&zone=montane');
    await user.press(await screen.findByRole('button', { name: 'Month: May' }));
    await user.press(screen.getByRole('radio', { name: 'Any month' }));
    expect(screen).toHaveSearchParams({ step: 'habitat', month: 'any', zone: 'montane' });
    expect(screen.getByRole('button', { name: 'Month: Any month' })).toBeTruthy();
  });
});
