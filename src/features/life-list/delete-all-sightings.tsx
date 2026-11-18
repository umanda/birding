import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { useLifeList } from './life-list-context';

type Step = 'idle' | 'confirming' | 'deleting' | 'done' | 'failed';

// Confirms in place (no modal) so the warning stays next to the button on every platform.
export function DeleteAllSightings(): React.JSX.Element {
  const { colors } = useTheme();
  const { language, t } = useSettings();
  const { status, sightings, removeAllUnsynced } = useLifeList();
  const [step, setStep] = useState<Step>('idle');
  const count = sightings.length;
  const canDelete = status === 'ready' && count > 0 && step !== 'deleting';

  const confirm = async (): Promise<void> => {
    setStep('deleting');
    try {
      await removeAllUnsynced();
      setStep('done');
    } catch {
      setStep('failed');
    }
  };

  const text = (
    key: Parameters<typeof t>[0],
    color: string = colors.text,
    style = 'body' as const,
  ) => <Text style={[typeStyle(style, language), { color }]}>{t(key)}</Text>;
  const button = (label: string, onPress: () => void, disabled: boolean, destructive = false) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        { borderColor: destructive ? colors.error : colors.textMuted },
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[typeStyle('label', language), { color: destructive ? colors.error : colors.text }]}
      >
        {label}
      </Text>
    </Pressable>
  );

  const summary =
    status === 'ready' && count === 0
      ? t('deleteAll.empty')
      : status === 'ready'
        ? t('deleteAll.count', { count })
        : '';
  const confirming = step === 'confirming' || step === 'deleting' || step === 'failed';

  return (
    <View style={styles.box}>
      <Text style={[typeStyle('body', language), { color: colors.text }]}>{summary}</Text>
      {confirming ? (
        <View style={[styles.confirm, { borderColor: colors.error }]}>
          <Text
            accessibilityRole="header"
            style={[typeStyle('title', language), { color: colors.text }]}
          >
            {t('deleteAll.confirmTitle')}
          </Text>
          {text('deleteAll.confirmBody')}
          <View style={styles.row}>
            {button(t('deleteAll.cancel'), () => setStep('idle'), step === 'deleting')}
            {button(t('deleteAll.confirm'), () => void confirm(), step === 'deleting', true)}
          </View>
        </View>
      ) : (
        button(t('deleteAll.button'), () => setStep('confirming'), !canDelete, true)
      )}
      <View accessibilityLiveRegion="polite">
        {step === 'done' && text('deleteAll.done')}
        {step === 'failed' && text('deleteAll.failed', colors.error)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: space[2], paddingVertical: space[4] },
  confirm: { gap: space[2], borderWidth: 2, borderRadius: radius.md, padding: space[4] },
  row: { flexDirection: 'row', gap: space[2] },
  button: {
    minHeight: size.buttonLg - 8,
    minWidth: size.buttonLg - 8,
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
});
