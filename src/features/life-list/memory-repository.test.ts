import { describeLifeListRepository } from './life-list-repository.contract';
import { createMemoryRepository } from './memory-repository';

describeLifeListRepository('memory', async (seedRows, deps) => ({
  repository: createMemoryRepository(seedRows, deps),
  cleanup: async () => {},
}));

describe('memory repository with junk rows', () => {
  it('skips rows that are not objects or have no usable id', async () => {
    const repository = createMemoryRepository(['junk', null, 5, {}, { id: undefined }]);
    expect(await repository.list()).toEqual([]);
    await repository.removeAllUnsynced();
    expect(await repository.list()).toEqual([]);
  });
});
