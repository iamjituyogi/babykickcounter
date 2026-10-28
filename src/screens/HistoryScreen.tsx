import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme';
import { fmtDate, fmtPeriod, fmtTime, Session } from '../storage';
import { ArrowLeft } from '../components/Icons';

type Props = { sessions: Session[]; onBack?: () => void };

export default function HistoryScreen({ sessions, onBack }: Props) {
  const cols = (cells: string[], head = false) =>
    cells.map((c, i) => (
      <Text key={i} style={[styles.cell, head ? styles.head : styles.body]}>
        {c}
      </Text>
    ));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.bar}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
            <ArrowLeft color={colors.primary} />
          </Pressable>
        ) : null}
        <Text style={styles.barTitle}>Baby Kicks History</Text>
      </View>
      <View style={[styles.row, { marginTop: 8 }]}>{cols(['DATE', 'FIRST', 'LAST', 'PERIOD', 'COUNT'], true)}</View>
      <FlatList
        data={sessions}
        keyExtractor={s => s.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>No sessions yet.{'\n'}Reach 10 kicks to save one.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {cols([
              fmtDate(item.first),
              fmtTime(item.first),
              fmtTime(item.last),
              fmtPeriod(item.first, item.last),
              String(item.count),
            ])}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  bar: { height: 56, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', left: 16 },
  barTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 16,
    ...shadow,
    shadowOpacity: 0.08,
    elevation: 2,
  },
  cell: { flex: 1, textAlign: 'center' },
  head: { fontSize: 13, fontWeight: '700', color: colors.muted },
  body: { fontSize: 15, fontWeight: '700', color: colors.text },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 60, fontSize: 15, lineHeight: 24 },
});
