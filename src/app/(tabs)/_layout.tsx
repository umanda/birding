import { Tabs } from 'expo-router/js-tabs';

import { LanguageToggle, useSettings } from '@/features/settings';
import type { MessageKey } from '@/shared/i18n/translate';

// Array order is the tab order; `index` is Identify, so it opens at "/".
const TABS: { name: string; labelKey: MessageKey }[] = [
  { name: 'index', labelKey: 'tabs.identify' },
  { name: 'search', labelKey: 'tabs.search' },
  { name: 'browse', labelKey: 'tabs.browse' },
  { name: 'life-list', labelKey: 'tabs.lifeList' },
  { name: 'me', labelKey: 'tabs.me' },
];

export default function TabsLayout() {
  const { t } = useSettings();
  return (
    <Tabs screenOptions={{ headerRight: () => <LanguageToggle /> }}>
      {TABS.map(({ name, labelKey }) => (
        <Tabs.Screen key={name} name={name} options={{ title: t(labelKey) }} />
      ))}
    </Tabs>
  );
}
