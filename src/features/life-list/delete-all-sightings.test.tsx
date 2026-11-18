import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { SettingsProvider } from '@/features/settings';
import { createMemoryStore } from '@/test-utils/memory-store';

import { DeleteAllSightings } from './delete-all-sightings';
import { LifeListProvider, useLifeList } from './life-list-context';
import type { LifeListRepository } from './life-list-repository';
import { createMemoryRepository } from './memory-repository';

jest.mock('./open-store', () => ({ openStore: jest.fn() }));
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

const input = { species_id: 'sp-1', content_version: 'v1', seen_on: '2020-01-02' };
const BUTTON = 'Delete all sightings on this device';

async function seeded(count: number): Promise<LifeListRepository> {
  const repo = createMemoryRepository();
  for (let i = 0; i < count; i++) await repo.add(input);
  return repo;
}

const show = (open: () => Promise<LifeListRepository>) =>
  render(
    <SettingsProvider store={createMemoryStore()}>
      <LifeListProvider open={open}>
        <DeleteAllSightings />
      </LifeListProvider>
    </SettingsProvider>,
  );

describe('DeleteAllSightings', () => {
  it('shows the count on this device', async () => {
    await show(() => seeded(2));
    expect(await screen.findByText('2 sightings saved on this device')).toBeTruthy();
  });

  it('disables the button when there is nothing to delete', async () => {
    await show(() => seeded(0));
    expect(await screen.findByText('No sightings saved on this device')).toBeTruthy();
    expect(screen.getByRole('button', { name: BUTTON })).toBeDisabled();
  });

  it('is disabled while the list is loading', async () => {
    await show(() => new Promise<LifeListRepository>(() => undefined));
    expect(screen.getByRole('button', { name: BUTTON })).toBeDisabled();
  });

  it('deletes everything after confirming and announces it', async () => {
    await show(() => seeded(2));
    await fireEvent.press(await screen.findByRole('button', { name: BUTTON }));
    expect(screen.getByText(/can't be undone/)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(await screen.findByText('All sightings deleted')).toBeTruthy();
    expect(screen.getByText('No sightings saved on this device')).toBeTruthy();
  });

  it('keeps the data when cancelled', async () => {
    await show(() => seeded(2));
    await fireEvent.press(await screen.findByRole('button', { name: BUTTON }));
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('2 sightings saved on this device')).toBeTruthy();
    expect(screen.queryByText('All sightings deleted')).toBeNull();
  });

  it('shows an error and keeps the data when deleting fails', async () => {
    const repo = await seeded(2);
    repo.removeAllUnsynced = () => Promise.reject(new Error('disk'));
    await show(async () => repo);
    await fireEvent.press(await screen.findByRole('button', { name: BUTTON }));
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(await screen.findByText(/Couldn't delete/)).toBeTruthy();
    expect(screen.getByText('2 sightings saved on this device')).toBeTruthy();
  });

  it('disables both buttons while deleting', async () => {
    const repo = await seeded(1);
    repo.removeAllUnsynced = () => new Promise<void>(() => undefined);
    await show(async () => repo);
    await fireEvent.press(await screen.findByRole('button', { name: BUTTON }));
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('drops the done message once a new sighting is added', async () => {
    let add: ReturnType<typeof useLifeList>['add'] = () => Promise.reject(new Error('unset'));
    function Grab(): null {
      add = useLifeList().add;
      return null;
    }
    const repo = await seeded(1);
    await render(
      <SettingsProvider store={createMemoryStore()}>
        <LifeListProvider open={async () => repo}>
          <DeleteAllSightings />
          <Grab />
        </LifeListProvider>
      </SettingsProvider>,
    );
    await fireEvent.press(await screen.findByRole('button', { name: BUTTON }));
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(await screen.findByText('All sightings deleted')).toBeTruthy();
    await act(async () => void (await add(input)));
    expect(screen.queryByText('All sightings deleted')).toBeNull();
  });
});
