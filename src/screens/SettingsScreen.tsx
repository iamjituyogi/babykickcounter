import React, { useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme';
import { ChevronRight, CloseCircle } from '../components/Icons';
import AppModal from '../components/AppModal';

const SUPPORT_EMAIL = 'support@kickcountbabytracker.app'; // TODO: replace with real address

type Page = { title: string; body: string } | null;

export default function SettingsScreen({ onClear }: { onClear: () => void }) {
  const [page, setPage] = useState<Page>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const items: { label: string; onPress: () => void }[] = [
    {
      label: 'About Us',
      onPress: () =>
        setPage({
          title: 'About Us',
          body: 'Kick Count Baby Tracker helps expecting mothers keep track of their baby’s movements. Tap each time you feel a kick, reach 10 kicks and the session is saved to your history.\n\nThis app is a helper, not a medical device. Always consult your doctor for medical advice.',
        }),
    },
    { label: 'Contact Us', onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Kick%20Counter%20Feedback`) },
    {
      label: 'Share App',
      onPress: () => Share.share({ message: 'Track your baby’s kicks with Kick Count Baby Tracker!' }),
    },
    {
      label: 'Privacy Policy',
      onPress: () =>
        setPage({
          title: 'Privacy Policy',
          body: 'All your data is stored only on this device. We do not collect, upload or share any personal information.',
        }),
    },
    {
      label: 'Clear History',
      onPress: () => setConfirmClear(true),
    },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {items.map(i => (
          <Pressable key={i.label} style={styles.row} onPress={i.onPress}>
            <Text style={styles.label}>{i.label}</Text>
            <ChevronRight color={colors.primary} />
          </Pressable>
        ))}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
      <AppModal
        visible={confirmClear}
        icon={<CloseCircle size={50} color={colors.primary} />}
        title="Clear history?"
        message="All saved sessions will be permanently deleted."
        actions={[
          { label: 'Cancel', secondary: true, onPress: () => setConfirmClear(false) },
          { label: 'Delete', onPress: () => { setConfirmClear(false); onClear(); } },
        ]}
        onRequestClose={() => setConfirmClear(false)}
      />
      <Modal visible={!!page} transparent animationType="fade" onRequestClose={() => setPage(null)}>
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dTitle}>{page?.title}</Text>
            <Text style={styles.dBody}>{page?.body}</Text>
            <Pressable style={styles.btn} onPress={() => setPage(null)}>
              <Text style={styles.btnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  title: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: colors.text, marginVertical: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 18,
    ...shadow,
    shadowOpacity: 0.08,
    elevation: 2,
  },
  label: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  version: { textAlign: 'center', color: colors.muted, marginTop: 16 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  dialog: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  dTitle: { fontSize: 20, fontWeight: '800', color: colors.primary, marginBottom: 10 },
  dBody: { fontSize: 15, color: colors.text, lineHeight: 22 },
  btn: { alignSelf: 'flex-end', marginTop: 18, backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 28 },
  btnText: { color: '#fff', fontWeight: '800' },
});
