import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { DeleteAllSightings } from '@/features/life-list';
import { useSettings } from '@/features/settings';
import { SCREEN_PADDING, size } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { PhotoPackSection } from './photo-pack-section';

export function MeScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.screen}>
      <Link href="/photo-credits" accessibilityRole="link" style={styles.link}>
        <Text style={[typeStyle('body', language), { color: colors.primary }]}>
          {t('credits.title')}
        </Text>
      </Link>
      <PhotoPackSection />
      <DeleteAllSightings />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: SCREEN_PADDING },
  link: { minHeight: size.touchMin, justifyContent: 'center' },
});
