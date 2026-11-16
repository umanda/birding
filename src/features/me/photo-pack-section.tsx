import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllImages } from '@/shared/data/media';
import type { ManifestImage } from '@/shared/data/media';
import { formatBytes, packPlan } from '@/shared/media/photo-pack-plan';
import { isOnline } from '@/shared/platform/is-online';
import { photoPack } from '@/shared/platform/photo-pack';
import type { PackResult, PhotoPack } from '@/shared/platform/photo-pack';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { downloader?: PhotoPack; images?: readonly ManifestImage[] };
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
    abort.current = new AbortController();
    setDone(0);
    setRun('running');
    const urls = plan.remaining.map((item) => item.url);
    const onProgress = setDone;
    setRun(await downloader.download(urls, { signal: abort.current.signal, onProgress }));
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
  const offline = !isOnline();
  const saved = plan.totalCount - plan.remaining.length;
  const progress = running ? saved + done : saved;
  const canDownload = !complete && !offline;
  const note = offline && !complete ? t('photoPack.offline') : undefined;
  return (
    <View style={styles.section}>
      {title}
      <Text style={text}>
        {t('photoPack.summary', { size: formatBytes(plan.totalBytes), count: plan.totalCount })}
      </Text>
      <Text style={muted}>{t('photoPack.wifi')}</Text>
      <View accessibilityLiveRegion="polite">
        <Text style={muted}>
          {complete
            ? t('photoPack.complete')
            : t('photoPack.progress', { done: progress, total: plan.totalCount })}
        </Text>
        {run === 'interrupted' && <Text style={muted}>{t('photoPack.interrupted')}</Text>}
        {note !== undefined && <Text style={muted}>{note}</Text>}
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
            { backgroundColor: colors.primary, opacity: !running && !canDownload ? 0.5 : 1 },
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
