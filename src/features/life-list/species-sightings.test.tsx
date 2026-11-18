import { AccessibilityInfo, Platform } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';

import { LifeListProvider } from './life-list-context';
import type { LifeListRepository } from './life-list-repository';
import { createMemoryRepository } from './memory-repository';
import { SpeciesSightings } from './species-sightings';

// The first render in a cold jest worker loads the theme, fonts and modal modules and can pass 5 s.
jest.setTimeout(30000);

const t = createT('en');
const name = { text: 'Sri Lanka Junglefowl', language: 'en' } as const;
const SPECIES = 'sp-1';
const base = { content_version: 'v1', place_name: 'Yala', count: 2, note: 'By the road' };

function tree(open: () => Promise<LifeListRepository>): React.JSX.Element {
  return (
    <LifeListProvider open={open}>
      <SpeciesSightings speciesId={SPECIES} name={name} language="en" t={t} />
    </LifeListProvider>
  );
}
const press = (label: string) => fireEvent.press(screen.getByRole('button', { name: label }));

describe('SpeciesSightings', () => {
  it('announces every save on iOS, even with the same text', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation();
    await render(tree(async () => createMemoryRepository()));
    await waitFor(() => expect(screen.getByRole('button', { name: 'I saw this' })).toBeEnabled());
    await press('I saw this');
    await press('Save');
    await screen.findByText('Saved on this device');
    await press('Add another sighting');
    await press('Save');
    await waitFor(() => expect(announce).toHaveBeenCalledTimes(2));
    expect(announce).toHaveBeenCalledWith('Saved on this device');
    announce.mockRestore();
    jest.restoreAllMocks();
  });

  it('offers "I saw this", saves, then confirms and summarises', async () => {
    const repo = createMemoryRepository();
    await render(tree(async () => repo));
    await waitFor(() => expect(screen.getByRole('button', { name: 'I saw this' })).toBeEnabled());
    await press('I saw this');
    await press('Save');
    expect(await screen.findByText('Saved on this device')).toBeTruthy();
    expect(screen.getByText(/^Seen 1 time · last \d{1,2} \w+ \d{4}$/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Add another sighting' })).toBeTruthy();
    expect(screen.queryByText('Save')).toBeNull();
  });

  it('counts only this species and names the newest date', async () => {
    const repo = createMemoryRepository();
    await repo.add({ ...base, species_id: SPECIES, seen_on: '2020-03-01' });
    await repo.add({ ...base, species_id: SPECIES, seen_on: '2020-11-18' });
    await repo.add({ ...base, species_id: 'other', seen_on: '2020-12-25' });
    await render(tree(async () => repo));
    expect(await screen.findByText('Seen 2 times · last 18 November 2020')).toBeTruthy();
  });

  it('disables the button while the store is loading', async () => {
    let finish: (repo: LifeListRepository) => void = () => undefined;
    const opening = new Promise<LifeListRepository>((resolve) => (finish = resolve));
    await render(tree(() => opening));
    expect(screen.getByRole('button', { name: 'I saw this' })).toBeDisabled();
    finish(createMemoryRepository());
    await waitFor(() => expect(screen.getByRole('button', { name: 'I saw this' })).toBeEnabled());
  });
});
