import { describeLifeListRepository } from './life-list-repository.contract';
import { createMemoryRepository } from './memory-repository';

describeLifeListRepository('memory', async (seedRows, deps) =>
  createMemoryRepository(seedRows, deps),
);
