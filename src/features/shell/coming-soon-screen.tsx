import { useSettings } from '@/features/settings';
import { ComingSoon } from '@/shared/ui/coming-soon';

export function ComingSoonScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  return <ComingSoon language={language} t={t} />;
}
