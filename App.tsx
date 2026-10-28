import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import { clearSessions, loadSessions, Session } from './src/storage';
import AppUpdateGate from './src/components/AppUpdateGate';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import GraphScreen from './src/screens/GraphScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { BarsIcon, GearIcon, HomeIcon, ListIcon } from './src/components/Icons';

type Tab = 'home' | 'history' | 'graph' | 'settings';
const TABS: { key: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'history', label: 'History', Icon: ListIcon },
  { key: 'graph', label: 'Graph', Icon: BarsIcon },
  { key: 'settings', label: 'Settings', Icon: GearIcon },
];

function Shell() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('home');
  const [sessions, setSessions] = useState<Session[]>([]);

  const refresh = useCallback(() => {
    loadSessions().then(setSessions);
  }, []);
  useEffect(refresh, [refresh]);

  const clear = async () => {
    await clearSessions();
    setSessions([]);
  };

  return (
    <View style={styles.root}>
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen onOpenHistory={() => setTab('history')} onSaved={refresh} />}
        {tab === 'history' && <HistoryScreen sessions={sessions} onBack={() => setTab('home')} />}
        {tab === 'graph' && <GraphScreen sessions={sessions} />}
        {tab === 'settings' && <SettingsScreen onClear={clear} />}
      </View>
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {TABS.map(({ key, label, Icon }) => {
          const on = tab === key;
          const c = on ? colors.primary : colors.muted;
          return (
            <Pressable key={key} style={styles.tab} onPress={() => setTab(key)}>
              <Icon size={24} color={c} />
              <Text style={[styles.tabText, { color: c }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AppUpdateGate>
        <Shell />
      </AppUpdateGate>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  tabText: { fontSize: 11, fontWeight: '700' },
});
