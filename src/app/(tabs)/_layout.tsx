import { Tabs } from 'expo-router/js-tabs';

import { LanguageToggle, useSettings } from '@/features/settings';
import type { MessageKey } from '@/shared/i18n/translate';
import { size } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

// Array order is the tab order; `index` is Identify, so it opens at "/".
const TABS: { name: string; labelKey: MessageKey }[] = [
  { name: 'index', labelKey: 'tabs.identify' },
  { name: 'search', labelKey: 'tabs.search' },
  { name: 'browse', labelKey: 'tabs.browse' },
  { name: 'life-list', labelKey: 'tabs.lifeList' },
  { name: 'me', labelKey: 'tabs.me' },
];

export default function TabsLayout(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <LanguageToggle />,
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { ...typeStyle('title', language), color: colors.text },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.bg, height: size.tabBar },
        tabBarLabelStyle: typeStyle('label', language),
      }}
    >
      {TABS.map(({ name, labelKey }) => (
        <Tabs.Screen key={name} name={name} options={{ title: t(labelKey) }} />
      ))}
    </Tabs>
  );
}
