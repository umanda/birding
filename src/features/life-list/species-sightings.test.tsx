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
    announce.mockClear(); // a spy that was not restored keeps its earlier calls
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

describe('SpeciesSightings rows', () => {
  async function seeded(wrap: (repo: LifeListRepository) => LifeListRepository = (r) => r) {
    const repo = createMemoryRepository();
    await repo.add({ ...base, species_id: SPECIES, seen_on: '2020-03-01' });
    await repo.add({ ...base, species_id: SPECIES, seen_on: '2020-11-18', place_name: 'Mannar' });
    await repo.add({
      ...base,
      species_id: 'other',
      seen_on: '2020-12-25',
      place_name: 'Elsewhere',
    });
    await render(tree(async () => wrap(repo)));
    await screen.findByText('Seen 2 times · last 18 November 2020');
  }

  it('lists only this species, newest first', async () => {
    await seeded();
    expect(screen.queryByText('Elsewhere')).toBeNull();
    const places = screen.getAllByText(/Yala|Mannar/).map((node) => node.props.children);
    expect(places).toEqual(['Mannar', 'Yala']);
  });

  it('edits a sighting through the sheet', async () => {
    await seeded();
    await press('Edit sighting from 18 November 2020');
    await fireEvent.changeText(screen.getByLabelText('Place (optional)'), 'Wilpattu');
    await press('Save');
    expect(await screen.findByText('Wilpattu')).toBeTruthy();
    expect(screen.queryByText('Mannar')).toBeNull();
  });

  it('deletes only after confirmation and announces it', async () => {
    await seeded();
    await press('Delete sighting from 18 November 2020');
    await press('Keep it');
    expect(screen.getByText('Mannar')).toBeTruthy();

    await press('Delete sighting from 18 November 2020');
    expect(screen.getByText('Delete this sighting?')).toBeTruthy();
    await press('Yes, delete sighting from 18 November 2020');
    await waitFor(() => expect(screen.queryByText('Mannar')).toBeNull());
    expect(screen.getByText('Sighting deleted')).toBeTruthy();
    expect(screen.getByText('Seen 1 time · last 1 March 2020')).toBeTruthy();
  });

  it('announces each of two deletes in a row', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation();
    announce.mockClear(); // a spy that was not restored keeps its earlier calls
    await seeded();
    for (const date of ['18 November 2020', '1 March 2020']) {
      await press(`Delete sighting from ${date}`);
      await press(`Yes, delete sighting from ${date}`);
      await waitFor(() => expect(screen.queryByText(`Delete this sighting?`)).toBeNull());
    }
    await waitFor(() => expect(announce).toHaveBeenCalledTimes(2));
    expect(announce).toHaveBeenNthCalledWith(2, 'Sighting deleted');
    announce.mockRestore();
  });

  it('keeps the row and says so when the delete fails', async () => {
    await seeded((repo) => ({ ...repo, remove: () => Promise.reject(new Error('disk full')) }));
    await press('Delete sighting from 18 November 2020');
    await press('Yes, delete sighting from 18 November 2020');
    expect(await screen.findByText("Couldn't delete. Please try again.")).toBeTruthy();
    expect(screen.getByText('Mannar')).toBeTruthy();
  });
});
