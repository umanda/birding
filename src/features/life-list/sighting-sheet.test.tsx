import { render, screen, userEvent } from '@testing-library/react-native';

import { createT } from '@/shared/i18n/translate';

import { NOTE_MAX, PLACE_NAME_MAX } from './sighting';
import type { Sighting } from './sighting';
import { SightingSheet } from './sighting-sheet';

const t = createT('en');
const TODAY = '2026-11-18';
const name = { text: 'Sri Lanka Junglefowl', language: 'en' } as const;

const saved: Sighting = {
  id: 'a',
  species_id: 's1',
  seen_on: '2026-11-01',
  place_name: 'විල්පත්තු',
  zone: 'dry_lowland',
  count: 4,
  note: 'Near the waterhole',
  lat_rounded: null,
  lon_rounded: null,
  content_version: 'v1',
  created_at: '2026-11-01T05:00:00.000Z',
  updated_at: '2026-11-01T05:00:00.000Z',
  deleted_at: null,
  synced_at: null,
};

async function setup(onSave = jest.fn().mockResolvedValue(undefined), sighting?: Sighting) {
  await render(
    <SightingSheet
      name={name}
      language="en"
      t={t}
      today={TODAY}
      sighting={sighting}
      onSave={onSave}
      onCancel={jest.fn()}
    />,
  );
  return { onSave, user: userEvent.setup() };
}

const saveButton = () => screen.getByRole('button', { name: /^(Save|Retry)$/ });

describe('SightingSheet', () => {
  it('opens with the species name and today, and saves only the date', async () => {
    const { onSave, user } = await setup();
    expect(screen.getByText('Sri Lanka Junglefowl')).toBeTruthy();
    expect(screen.getByLabelText('Date (YYYY-MM-DD)').props.value).toBe(TODAY);
    await user.press(saveButton());
    expect(onSave).toHaveBeenCalledWith({
      seen_on: TODAY,
      place_name: null,
      zone: null,
      count: null,
      note: null,
    });
  });

  it('rejects a future date and accepts Yesterday', async () => {
    const { user } = await setup();
    await user.clear(screen.getByLabelText('Date (YYYY-MM-DD)'));
    await user.type(screen.getByLabelText('Date (YYYY-MM-DD)'), '2026-11-19');
    expect(screen.getByText(/today or earlier/)).toBeTruthy();
    expect(saveButton()).toBeDisabled();
    await user.press(screen.getByRole('button', { name: 'Yesterday' }));
    expect(screen.getByLabelText('Date (YYYY-MM-DD)').props.value).toBe('2026-11-17');
    expect(saveButton()).toBeEnabled();
  });

  it('limits place and note length with the validator constants', async () => {
    await setup();
    expect(screen.getByLabelText('Place (optional)').props.maxLength).toBe(PLACE_NAME_MAX);
    expect(screen.getByLabelText('Note (optional)').props.maxLength).toBe(NOTE_MAX);
    expect(screen.getByLabelText('How many (optional)').props.maxLength).toBe(3);
  });

  it('selects one zone and clears it when tapped again', async () => {
    const { user } = await setup();
    await user.press(screen.getByRole('radio', { name: /^Montane/ }));
    expect(screen.getByRole('radio', { name: /^Montane/, checked: true })).toBeTruthy();
    await user.press(screen.getByRole('radio', { name: /^Dry lowlands/ }));
    expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1);
    await user.press(screen.getByRole('radio', { name: /^Dry lowlands/ }));
    expect(screen.queryAllByRole('radio', { checked: true })).toHaveLength(0);
  });

  it.each(['0', '1.5', 'ab'])('blocks the count %s', async (count) => {
    const { user } = await setup();
    await user.type(screen.getByLabelText('How many (optional)'), count);
    expect(screen.getByText(/whole number from 1 to 999/)).toBeTruthy();
    expect(saveButton()).toBeDisabled();
  });

  it('saves cleaned fields and keeps Sinhala text as typed', async () => {
    const { onSave, user } = await setup();
    await user.type(screen.getByLabelText('Place (optional)'), 'යාල');
    await user.press(screen.getByRole('radio', { name: /^Montane/ }));
    await user.type(screen.getByLabelText('How many (optional)'), '12');
    await user.type(screen.getByLabelText('Note (optional)'), '   ');
    await user.press(saveButton());
    expect(onSave).toHaveBeenCalledWith({
      seen_on: TODAY,
      place_name: 'යාල',
      zone: 'montane',
      count: 12,
      note: null,
    });
  });

  it('disables Save while saving', async () => {
    const onSave = jest.fn(() => new Promise<void>(() => undefined));
    const { user } = await setup(onSave);
    await user.press(saveButton());
    expect(saveButton()).toBeDisabled();
  });

  it('keeps the input and offers Retry when saving fails', async () => {
    const onSave = jest.fn().mockRejectedValueOnce(new Error('quota')).mockResolvedValue(undefined);
    const { user } = await setup(onSave);
    await user.type(screen.getByLabelText('Place (optional)'), 'Yala');
    await user.press(saveButton());
    expect(screen.getByText(/Couldn't save/)).toBeTruthy();
    expect(screen.getByLabelText('Place (optional)').props.value).toBe('Yala');
    await user.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onSave).toHaveBeenCalledTimes(2);
    expect(screen.queryByText(/Couldn't save/)).toBeNull();
  });

  it('prefills every field in edit mode', async () => {
    await setup(undefined, saved);
    expect(screen.getByText('Edit sighting')).toBeTruthy();
    expect(screen.getByLabelText('Date (YYYY-MM-DD)').props.value).toBe('2026-11-01');
    expect(screen.getByLabelText('Place (optional)').props.value).toBe('විල්පත්තු');
    expect(screen.getByRole('radio', { name: /^Dry lowlands/, checked: true })).toBeTruthy();
    expect(screen.getByLabelText('How many (optional)').props.value).toBe('4');
    expect(screen.getByLabelText('Note (optional)').props.value).toBe('Near the waterhole');
  });
});
