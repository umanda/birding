import { getSpeciesTraits } from '@/shared/data/traits-data';

import { QuestionScreen } from './question-screen';

export function QuestionRoute(): React.JSX.Element {
  return <QuestionScreen traits={getSpeciesTraits()} />;
}
