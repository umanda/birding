import { useSettings } from '@/features/settings';
import { ComingSoon } from '@/shared/ui/coming-soon';

export default function ComingSoonScreen() {
  const { t } = useSettings();
  return <ComingSoon title={t('comingSoon.title')} body={t('comingSoon.body')} />;
}
