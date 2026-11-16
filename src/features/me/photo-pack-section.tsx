import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllImages } from '@/shared/data/media';
import type { ManifestImage } from '@/shared/data/media';
import { formatBytes, packPlan } from './photo-pack-plan';
import { photoPack } from '@/shared/platform/photo-pack';
import type { Translate } from '@/shared/i18n/translate';
import type { PackResult, PhotoPack } from '@/shared/platform/photo-pack';
import { useIsOnline } from '@/shared/platform/use-is-online';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { downloader?: PhotoPack; images?: readonly ManifestImage[] };
const DISABLED_OPACITY = 0.5;
type Run = 'idle' | 'running' | PackResult;

export function PhotoPackSection({
  downloader = photoPack,
  images = getAllImages(),
}: Props): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const [cached, setCached] = useState<ReadonlySet<string>>(new Set());
  const [run, setRun] = useState<Run>('idle');
  const [done, setDone] = useState(0);
  const online = useIsOnline();
  const abort = useRef<AbortController | null>(null);
  const plan = packPlan(images, cached);
  const text = [typeStyle('body', language), { color: colors.text }];
  const muted = [typeStyle('caption', language), { color: colors.textMuted }];

  const refresh = useCallback(() => downloader.listCachedUrls().then(setCached), [downloader]);
  useEffect(() => {
    void refresh();
    return () => abort.current?.abort();
  }, [refresh]);

  async function start(): Promise<void> {
    if (abort.current) return; // a second tap while running
    const controller = new AbortController();
    abort.current = controller;
    setDone(0);
    setRun('running');
    let result: PackResult = 'interrupted';
    try {
      const urls = plan.remaining.map((item) => item.url);
      result = await downloader.download(urls, { signal: controller.signal, onProgress: setDone });
    } catch {
      result = 'interrupted';
    } finally {
      abort.current = null;
      setRun(result);
    }
    await refresh();
  }

  const title = (
    <Text style={[typeStyle('label', language), { color: colors.text }]}>
      {t('photoPack.title')}
    </Text>
  );
  if (!downloader.isSupported()) {
    return (
      <View style={styles.section}>
        {title}
        <Text style={muted}>{t('photoPack.nativeUnavailable')}</Text>
      </View>
    );
  }
  if (plan.totalCount === 0) {
    return (
      <View style={styles.section}>
        {title}
        <Text style={muted}>{t('credits.empty')}</Text>
      </View>
    );
  }

  const running = run === 'running';
  const complete = plan.remaining.length === 0;
  const offline = !online;
  const saved = plan.totalCount - plan.remaining.length;
  const progress = running ? saved + done : saved;
  const canDownload = !complete && !offline;
  const stopped = !running && !offline && (run === 'interrupted' || run === 'cancelled');
  const liveText = liveMessage(t, { running, complete, stopped });
  return (
    <View style={styles.section}>
      {title}
      <Text style={text}>
        {t('photoPack.summary', { size: formatBytes(plan.totalBytes), count: plan.totalCount })}
      </Text>
      <Text style={muted}>{t('photoPack.wifi')}</Text>
      {!complete && (
        <Text style={muted}>
          {t('photoPack.progress', { done: progress, total: plan.totalCount })}
          {saved > 0 && `. ${t('photoPack.remaining', { size: formatBytes(plan.remainingBytes) })}`}
        </Text>
      )}
      {offline && !complete && <Text style={muted}>{t('photoPack.offline')}</Text>}
      <View accessibilityLiveRegion="polite">
        {liveText !== undefined && <Text style={muted}>{liveText}</Text>}
      </View>
      {!complete && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(running ? 'photoPack.cancel' : 'photoPack.download')}
          accessibilityState={{ disabled: !running && !canDownload }}
          disabled={!running && !canDownload}
          onPress={running ? () => abort.current?.abort() : () => void start()}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: !running && !canDownload ? DISABLED_OPACITY : 1,
            },
          ]}
        >
          <Text style={[typeStyle('label', language), { color: colors.bg }]}>
            {t(running ? 'photoPack.cancel' : 'photoPack.download')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

type LiveState = { running: boolean; complete: boolean; stopped: boolean };

// Only start, completion and stop are announced; the running count is not.
function liveMessage(t: Translate, state: LiveState): string | undefined {
  if (state.complete) return t('photoPack.complete');
  if (state.running) return t('photoPack.started');
  if (state.stopped) return t('photoPack.interrupted');
  return undefined;
}

const styles = StyleSheet.create({
  section: { gap: space[2], paddingVertical: space[4] },
  button: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
  },
});
