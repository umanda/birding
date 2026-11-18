import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ZONES } from '@/shared/data/traits-vocabulary';
import type { Language } from '@/shared/i18n/language';
import type { Rendered } from '@/shared/i18n/localized';
import type { MessageKey, Translate } from '@/shared/i18n/translate';
import { borderWidth, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { NOTE_MAX, PLACE_NAME_MAX, toLocalDate } from './sighting';
import type { CleanFields, Sighting } from './sighting';
import {
  dayBefore,
  emptyValues,
  findErrorKey,
  toCleanFields,
  valuesFromSighting,
} from './sighting-form';
import type { FormValues } from './sighting-form';

const COUNT_INPUT_MAX_LENGTH = 3; // "999"
const DATE_INPUT_MAX_LENGTH = 10; // "YYYY-MM-DD"

type Props = {
  name: Rendered; // species name, already in the UI language
  language: Language;
  t: Translate;
  sighting?: Sighting | undefined; // present means edit mode
  today?: string; // injected by tests
  onSave: (fields: CleanFields) => Promise<void>;
  onCancel: () => void;
};

/** Add or edit sheet. Mount it when it opens so every open starts from fresh values. */
export function SightingSheet({
  name,
  language,
  t,
  sighting,
  today,
  onSave,
  onCancel,
}: Props): React.JSX.Element {
  const { colors } = useTheme();
  const [todayDate] = useState(() => today ?? toLocalDate(new Date()));
  const [values, setValues] = useState<FormValues>(() =>
    sighting ? valuesFromSighting(sighting) : emptyValues(todayDate),
  );
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const errorKey = findErrorKey(values, todayDate);
  const set = (change: Partial<FormValues>): void => setValues((v) => ({ ...v, ...change }));

  const save = async (): Promise<void> => {
    setSaving(true);
    setFailed(false);
    try {
      await onSave(toCleanFields(values));
    } catch {
      setFailed(true); // keep the input so Retry loses nothing
    } finally {
      setSaving(false);
    }
  };

  const textStyle = (name: 'title' | 'body' | 'label') => [
    typeStyle(name, language),
    { color: colors.text },
  ];
  const inputStyle = [styles.input, textStyle('body'), { borderColor: colors.primary }];
  const label = (key: MessageKey): React.JSX.Element => (
    <Text style={textStyle('label')}>{t(key)}</Text>
  );
  const button = (text: string, onPress: () => void, disabled = false): React.JSX.Element => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, { borderColor: colors.primary, opacity: disabled ? 0.5 : 1 }]}
    >
      <Text style={textStyle('label')}>{text}</Text>
    </Pressable>
  );
  const message = (key: MessageKey): React.JSX.Element => (
    <Text accessibilityRole="alert" style={[typeStyle('body', language), { color: colors.error }]}>
      {t(key)}
    </Text>
  );

  return (
    <Modal transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.modal}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          contentContainerStyle={styles.content}
        >
          <Text accessibilityRole="header" style={textStyle('title')}>
            {t(sighting ? 'sighting.title.edit' : 'sighting.title.add')}
          </Text>
          <Text style={[typeStyle('body', name.language), { color: colors.text }]}>
            {name.text}
          </Text>

          {label('sighting.date')}
          <TextInput
            accessibilityLabel={t('sighting.date')}
            value={values.seen_on}
            onChangeText={(seen_on) => set({ seen_on })}
            maxLength={DATE_INPUT_MAX_LENGTH}
            keyboardType="numbers-and-punctuation"
            style={inputStyle}
          />
          <View style={styles.row}>
            {button(t('sighting.today'), () => set({ seen_on: todayDate }))}
            {button(t('sighting.yesterday'), () => set({ seen_on: dayBefore(todayDate) }))}
          </View>

          {label('sighting.place')}
          <TextInput
            accessibilityLabel={t('sighting.place')}
            value={values.place}
            onChangeText={(place) => set({ place })}
            maxLength={PLACE_NAME_MAX}
            style={inputStyle}
          />

          {label('sighting.zone')}
          <View role="radiogroup" style={styles.row}>
            {ZONES.map((zone) => {
              const checked = values.zone === zone;
              return (
                <Pressable
                  key={zone}
                  accessibilityRole="radio"
                  accessibilityLabel={t(`identify.zone.${zone}`)}
                  accessibilityState={{ checked }}
                  aria-checked={checked}
                  onPress={() => set({ zone: checked ? null : zone })}
                  style={[
                    styles.button,
                    {
                      borderColor: colors.primary,
                      borderWidth: checked ? borderWidth.thick : borderWidth.thin,
                    },
                  ]}
                >
                  <Text style={textStyle('body')}>
                    {checked ? <Text aria-hidden>{'✓ '}</Text> : null}
                    {t(`identify.zone.${zone}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {label('sighting.count')}
          <TextInput
            accessibilityLabel={t('sighting.count')}
            value={values.count}
            onChangeText={(count) => set({ count })}
            maxLength={COUNT_INPUT_MAX_LENGTH}
            keyboardType="number-pad"
            style={inputStyle}
          />

          {label('sighting.note')}
          <TextInput
            accessibilityLabel={t('sighting.note')}
            value={values.note}
            onChangeText={(note) => set({ note })}
            maxLength={NOTE_MAX}
            multiline
            style={[inputStyle, styles.note]}
          />

          <View aria-live="polite">
            {errorKey ? message(errorKey) : null}
            {failed ? message('sighting.saveFailed') : null}
          </View>
          <View style={styles.row}>
            {button(t('sighting.cancel'), onCancel)}
            {button(t(failed ? 'sighting.retry' : 'sighting.save'), save, saving || !!errorKey)}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, justifyContent: 'flex-end' },
  sheet: { maxHeight: '90%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  content: { padding: space[4], gap: space[2] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  input: {
    minHeight: size.rowMin,
    paddingHorizontal: space[3],
    borderWidth: borderWidth.thin,
    borderRadius: radius.md,
  },
  note: { minHeight: size.rowMin * 2, textAlignVertical: 'top' },
  button: {
    minHeight: size.rowMin,
    minWidth: size.rowMin,
    paddingHorizontal: space[3],
    justifyContent: 'center',
    borderWidth: borderWidth.thin,
    borderRadius: radius.pill,
  },
});
