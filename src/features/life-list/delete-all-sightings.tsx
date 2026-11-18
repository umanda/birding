import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { useLifeList } from './life-list-context';

type Step = 'idle' | 'confirming' | 'deleting' | 'done' | 'failed';

const DISABLED_OPACITY = 0.5; // same value as sighting-sheet and photo-pack-section

// Confirms in place (no modal) so the warning stays next to the button on every platform.
export function DeleteAllSightings(): React.JSX.Element {
  const { colors } = useTheme();
  const { language, t } = useSettings();
  const { status, sightings, removeAllUnsynced } = useLifeList();
  const [step, setStep] = useState<Step>('idle');
  const titleRef = useRef<React.ComponentRef<typeof Text>>(null);
  const count = sightings.length;
  const ready = status === 'ready';
  const deleting = step === 'deleting';
  const confirming = step === 'confirming' || deleting || step === 'failed';
  // The done message belongs to the empty list; new sightings make it stale.
  const doneShown = step === 'done' && count === 0;
  const result = resultMessage();

  function resultMessage(): string {
    if (doneShown) return t('deleteAll.done');
    if (step === 'failed') return t('deleteAll.failed');
    return '';
  }

  // iOS ignores accessibilityLiveRegion, so it needs an explicit announcement.
  useEffect(() => {
    if (result && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(result);
  }, [result]);

  // Move screen-reader focus to the confirm title. Web has no equivalent (react-native-web
  // throws in findNodeHandle and lacks sendAccessibilityEvent), so it is skipped there.
  useEffect(() => {
    if (step !== 'confirming' || Platform.OS === 'web' || !titleRef.current) return;
    AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
  }, [step]);

  const confirm = async (): Promise<void> => {
    setStep('deleting');
    try {
      await removeAllUnsynced();
      setStep('done');
    } catch {
      setStep('failed');
    }
  };

  const summary = (): string => {
    if (!ready) return '';
    if (count === 0) return t('deleteAll.empty');
    return t('deleteAll.count', { count });
  };

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

  return (
    <View style={styles.box}>
      <Text style={[typeStyle('body', language), { color: colors.text }]}>{summary()}</Text>
      {confirming ? (
        <View style={[styles.confirm, { borderColor: colors.error }]}>
          <Text
            ref={titleRef}
            accessibilityRole="header"
            style={[typeStyle('title', language), { color: colors.text }]}
          >
            {t('deleteAll.confirmTitle')}
          </Text>
          <Text style={[typeStyle('body', language), { color: colors.text }]}>
            {t('deleteAll.confirmBody')}
          </Text>
          <View style={styles.row}>
            {button(t('deleteAll.cancel'), () => setStep('idle'), deleting)}
            {button(t('deleteAll.confirm'), () => void confirm(), deleting, true)}
          </View>
        </View>
      ) : (
        button(t('deleteAll.button'), () => setStep('confirming'), !ready || count === 0, true)
      )}
      <View accessibilityLiveRegion="polite">
        {result ? (
          <Text
            style={[
              typeStyle('body', language),
              { color: step === 'failed' ? colors.error : colors.text },
            ]}
          >
            {result}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: space[2], paddingVertical: space[4] },
  confirm: { gap: space[2], borderWidth: 2, borderRadius: radius.md, padding: space[4] },
  row: { flexDirection: 'row', gap: space[2] },
  button: {
    minHeight: size.touchMin,
    minWidth: size.touchMin,
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    justifyContent: 'center',
  },
  disabled: { opacity: DISABLED_OPACITY },
});
