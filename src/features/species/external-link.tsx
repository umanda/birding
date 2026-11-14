import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { isOnline } from '@/shared/platform/is-online';
import { size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { url: string; label?: string; language: Language; t: (key: MessageKey) => string };

// Only web links are opened; anything else in a citation stays plain text.
const WEB_URL = /^https?:/; //i;

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// Links are the one thing that needs a network, so offline we say so and stay on the page.
export function ExternalLink({ url, label, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const [offline, setOffline] = useState(false);
  const domain = domainOf(url);
  const text = label ? `${label} (${domain})` : domain;
  const textStyle = [typeStyle('body', label ? language : 'en'), { color: colors.primary }];

  if (!WEB_URL.test(url)) return <Text style={textStyle}>{url}</Text>;

  const open = (): void => {
    const online = isOnline();
    setOffline(!online);
    if (online) Linking.openURL(url).catch(() => setOffline(true));
  };

  return (
    <View>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={text}
        onPress={open}
        style={styles.link}
      >
        <Text style={[textStyle, styles.text]}>{text}</Text>
      </Pressable>
      {offline ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[typeStyle('label', language), { color: colors.textMuted }]}
        >
          {t('species.link.offline')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: size.touchMin, justifyContent: 'center', paddingVertical: space[1] },
  text: { textDecorationLine: 'underline' },
});
