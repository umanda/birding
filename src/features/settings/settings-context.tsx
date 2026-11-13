import { getLocales } from 'expo-localization';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';

import { isLanguage, languageFromLocale } from '@/shared/i18n/language';
import type { Language } from '@/shared/i18n/language';
import { createT } from '@/shared/i18n/translate';
import type { MessageKey, Vars } from '@/shared/i18n/translate';
import type { KeyValueStore } from '@/shared/platform/types';

export const LANGUAGE_STORAGE_KEY = 'settings.language';

// Same on server and client so static web hydrates without a mismatch.
const INITIAL_LANGUAGE: Language = 'en';

type Settings = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, vars?: Vars) => string;
};

const SettingsContext = createContext<Settings | null>(null);

type Props = { store: KeyValueStore; children: ReactNode };

export function SettingsProvider({ store, children }: Props): ReactNode {
  const [language, setLanguageState] = useState<Language>(INITIAL_LANGUAGE);
  const userChose = useRef(false);

  useEffect(() => {
    let ignore = false;
    // Persistence is best-effort: if reading fails we keep the device default.
    const readSaved = store.getItem(LANGUAGE_STORAGE_KEY).catch(() => null);
    void readSaved.then((saved) => {
      if (ignore || userChose.current) return;
      const device = languageFromLocale(getLocales()[0]?.languageCode);
      setLanguageState(isLanguage(saved) ? saved : device);
    });
    return () => {
      ignore = true;
    };
  }, [store]);

  // Sinhala line-heights are applied per script via the root lang attribute (web only).
  useEffect(() => {
    if (Platform.OS === 'web') document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(
    (next: Language) => {
      userChose.current = true;
      setLanguageState(next);
      // Best-effort: a failed write only means the choice is not remembered.
      store.setItem(LANGUAGE_STORAGE_KEY, next).catch(() => undefined);
    },
    [store],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t: createT(language) }),
    [language, setLanguage],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Settings {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error('useSettings must be used inside SettingsProvider');
  return settings;
}
