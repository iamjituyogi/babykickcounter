import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Action = { label: string; onPress: () => void; secondary?: boolean };

type Props = {
  visible: boolean;
  icon: React.ReactNode;
  title: string;
  message: string;
  sub?: string;
  actions: Action[];
  onRequestClose: () => void;
};

export default function AppModal({ visible, icon, title, message, sub, actions, onRequestClose }: Props) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      a.setValue(0);
      Animated.spring(a, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }).start();
    }
  }, [visible, a]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onRequestClose}>
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <Animated.View style={[styles.dialog, { opacity: a, transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
          <View style={styles.badge}>{icon}</View>
          <Pressable>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {sub ? <Text style={styles.sub}>{sub}</Text> : null}
            <View style={styles.actions}>
              {actions.map(act => (
                <Pressable
                  key={act.label}
                  onPress={act.onPress}
                  style={[styles.btn, act.secondary ? styles.btnSecondary : styles.btnPrimary]}>
                  <Text style={[styles.btnText, act.secondary && { color: colors.primary }]}>{act.label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(40,10,20,0.5)', alignItems: 'center', justifyContent: 'center' },
  dialog: {
    width: '84%',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 52,
    marginTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  badge: {
    position: 'absolute',
    top: -44,
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    borderWidth: 5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  message: { fontSize: 15, lineHeight: 22, color: '#444', textAlign: 'center', marginTop: 10 },
  sub: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: { flex: 1, paddingVertical: 13, borderRadius: 26, alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.primaryLight },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
