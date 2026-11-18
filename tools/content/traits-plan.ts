import { parse } from 'csv-parse/sync';
import type { LedgerRow } from './traits-ledger';

export const PLAN_COLUMNS = ['species_id', 'batch'];
export type PlanRow = { species_id: string; batch: string };

// The plan says which species a batch holds from the day it is drafted. The ledger only
// gets a row once the owner approves, so a sheet cannot be driven by the ledger alone.
export function parsePlan(csv: string): { rows: PlanRow[]; errors: string[] } {
  let table: string[][];
  try {
    table = parse(csv, { skip_empty_lines: true, bom: true });
  } catch (error) {
    return { rows: [], errors: [`traits-plan.csv cannot be parsed: ${(error as Error).message}`] };
  }
  const [header = [], ...records] = table;
  if (header.join(',') !== PLAN_COLUMNS.join(',')) {
    return { rows: [], errors: [`traits-plan.csv header must be: ${PLAN_COLUMNS.join(',')}`] };
  }
  const rows = records.map(([species_id = '', batch = '']) => ({ species_id, batch }));
  return { rows, errors: [] };
}

export function validatePlan(csv: string, speciesIds: ReadonlySet<string>, ledger: LedgerRow[]): string[] {
  const { rows, errors } = parsePlan(csv);
  const seen = new Set<string>();
  for (const { species_id: id, batch } of rows) {
    if (!speciesIds.has(id)) errors.push(`traits-plan.csv: ${id}: unknown species_id`);
    if (!/^\d+$/.test(batch)) errors.push(`traits-plan.csv: ${id}: batch must be a whole number`);
    if (seen.has(id)) errors.push(`traits-plan.csv: ${id}: duplicate species`);
    seen.add(id);
    const approved = ledger.find((l) => l.species_id === id);
    if (approved && approved.batch !== batch) {
      errors.push(`traits-plan.csv: ${id}: batch ${batch} but the ledger says ${approved.batch}`);
    }
  }
  // An approved species must be planned, or its batch would never get a review sheet.
  for (const { species_id: id } of ledger) {
    if (!seen.has(id)) errors.push(`traits-plan.csv: ${id}: in the ledger but not planned`);
  }
  return errors;
}
