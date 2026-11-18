import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { useLifeList } from './life-list-context';

export const STORAGE_BANNER_TEST_ID = 'storage-banner-region';

// The live region stays mounted so screen readers announce the text when it appears.
export function StorageBanner(): React.JSX.Element {
  const { colors } = useTheme();
  const { language, t } = useSettings();
  const { storage } = useLifeList();
  return (
    <View accessibilityLiveRegion="polite" testID={STORAGE_BANNER_TEST_ID}>
      {storage === 'memory' && (
        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <Text style={[typeStyle('body', language), { color: colors.text }]}>
            {t('lifeList.storageBlocked')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { paddingHorizontal: space[4], paddingVertical: space[2] },
});
