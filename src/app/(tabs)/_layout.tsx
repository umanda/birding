import { Tabs } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';

import { LanguageToggle, useSettings } from '@/features/settings';
import type { MessageKey } from '@/shared/i18n/translate';
import { useServiceWorkerUpdate } from '@/shared/platform/service-worker-update';
import { size } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { UpdateBanner } from '@/shared/ui/update-banner';

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
  const { updateAvailable, reload } = useServiceWorkerUpdate();
  return (
    <View style={styles.root}>
      {updateAvailable && <UpdateBanner language={language} t={t} onReload={reload} />}
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
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
