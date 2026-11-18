import { useEffect } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { useLifeList } from './life-list-context';

export const STORAGE_BANNER_TEST_ID = 'storage-banner-region';

/** The banner for screens that read the UI language from settings (the tabs). */
export function StorageBanner(): React.JSX.Element {
  const { language, t } = useSettings();
  return <StorageBannerView language={language} t={t} />;
}

type Props = { language: Language; t: Translate };

// The live region stays mounted so screen readers announce the text when it appears.
export function StorageBannerView({ language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const { storage } = useLifeList();
  const blocked = storage === 'memory';
  const message = t('lifeList.storageBlocked');

  // iOS ignores accessibilityLiveRegion, so it needs an explicit announcement.
  useEffect(() => {
    if (blocked && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(message);
  }, [blocked, message]);

  return (
    <View accessibilityLiveRegion="polite" testID={STORAGE_BANNER_TEST_ID}>
      {blocked && (
        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <Text style={[typeStyle('body', language), { color: colors.text }]}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { paddingHorizontal: space[4], paddingVertical: space[2] },
});
