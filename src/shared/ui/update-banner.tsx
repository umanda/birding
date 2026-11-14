import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { language: Language; t: (key: MessageKey) => string; onReload: () => void };
type RegionProps = Props & { visible: boolean };

export const UPDATE_REGION_TEST_ID = 'update-region';

// The live region stays mounted so screen readers announce the banner when it appears;
// a live region that is inserted together with its content is often not announced.
export function UpdateBannerRegion({ visible, ...props }: RegionProps): React.JSX.Element {
  return (
    <View accessibilityLiveRegion="polite" testID={UPDATE_REGION_TEST_ID}>
      {visible && <UpdateBanner {...props} />}
    </View>
  );
}

// Non-blocking: nothing reloads until the user presses the button.
export function UpdateBanner({ language, t, onReload }: Props): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.banner, { backgroundColor: colors.surface }]}>
      <Text style={[typeStyle('body', language), styles.message, { color: colors.text }]}>
        {t('update.available')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('update.reload')}
        onPress={onReload}
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={[typeStyle('label', language), { color: colors.bg }]}>
          {t('update.reload')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[4],
    paddingVertical: space[2],
  },
  message: { flex: 1 },
  button: {
    minHeight: size.touchMin,
    minWidth: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
  },
});
