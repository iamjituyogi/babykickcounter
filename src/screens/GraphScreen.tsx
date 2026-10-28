import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme';
import { fmtDate, Session } from '../storage';

type Metric = 'minutes' | 'kicks';
const H = 200;

function Bar({ ratio, label, value }: { ratio: number; label: string; value: string }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, { toValue: ratio, duration: 700, useNativeDriver: false }).start();
  }, [ratio, a]);
  return (
    <View style={styles.barCol}>
      <Text style={styles.barVal}>{value}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { height: a.interpolate({ inputRange: [0, 1], outputRange: [0, H] }) }]} />
      </View>
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

export default function GraphScreen({ sessions }: { sessions: Session[] }) {
  const [metric, setMetric] = useState<Metric>('minutes');
  const data = sessions.slice(0, 10).reverse();
  const values = data.map(s => (metric === 'kicks' ? s.count : Math.max(1, Math.round((s.last - s.first) / 60000))));
  const max = Math.max(1, ...values);
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>Kicks Graph</Text>
      <View style={styles.toggle}>
        {(['minutes', 'kicks'] as Metric[]).map(m => (
          <Pressable key={m} onPress={() => setMetric(m)} style={[styles.tab, metric === m && styles.tabOn]}>
            <Text style={[styles.tabText, metric === m && { color: '#fff' }]}>
              {m === 'minutes' ? 'Time to 10 kicks (min)' : 'Kick count'}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.card}>
        {data.length === 0 ? (
          <Text style={styles.empty}>No data yet.{'\n'}Complete a session to see your graph.</Text>
        ) : (
          <>
            <Text style={styles.avg}>
              Average: <Text style={{ color: colors.primary }}>{avg}{metric === 'minutes' ? ' min' : ' kicks'}</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bars}>
              {data.map((s, i) => (
                <Bar key={s.id} ratio={values[i] / max} label={fmtDate(s.first)} value={String(values[i])} />
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  title: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: colors.text, marginVertical: 16 },
  toggle: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: colors.primaryLight, borderRadius: 24, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  tabOn: { backgroundColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  card: { margin: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, ...shadow, shadowOpacity: 0.08, elevation: 2 },
  avg: { fontSize: 15, fontWeight: '700', color: colors.muted, marginBottom: 12 },
  bars: { alignItems: 'flex-end', paddingTop: 8 },
  barCol: { alignItems: 'center', width: 48, marginHorizontal: 4 },
  barVal: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 4 },
  track: { height: H, width: 26, justifyContent: 'flex-end', backgroundColor: colors.background, borderRadius: 13, overflow: 'hidden' },
  fill: { width: 26, backgroundColor: colors.primary, borderRadius: 13 },
  barLabel: { fontSize: 11, color: colors.muted, marginTop: 6, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.muted, paddingVertical: 50, lineHeight: 24 },
});
