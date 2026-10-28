import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { colors, shadow } from '../theme';
import { isUpdateRequired, isValidStoreUrl } from '../utils/appVersion';
import { RequiredAppVersion, subscribeAppVersion } from '../services/appUpdate';
import { ArrowRight, Heart } from './Icons';

/**
 * Root guard: listens to /appVersion in Firebase. While the installed version
 * is older than the required one, the whole app is replaced by the update
 * screen (no close button), so the user must update from the Play Store.
 * Firebase unreachable / bad data → the app opens as normal.
 */
export default function AppUpdateGate({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RequiredAppVersion | null>(null);
  const installed = DeviceInfo.getVersion();

  useEffect(
    () =>
      subscribeAppVersion(setConfig, e => {
        console.warn('App version check failed', e);
      }),
    [],
  );

  const required =
    !!config?.enabled && !!config.requiredVersion && isUpdateRequired(installed, config.requiredVersion);

  if (required && config) {
    return <UpdateScreen installed={installed} config={config} />;
  }
  return <>{children}</>;
}

function UpdateScreen({ installed, config }: { installed: string; config: RequiredAppVersion }) {
  const [error, setError] = useState<string | null>(null);
  const card = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    Animated.spring(card, { toValue: 1, friction: 7, tension: 70, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => {
      sub.remove();
      loop.stop();
    };
  }, [card, pulse]);

  const update = async () => {
    setError(null);
    if (!isValidStoreUrl(config.storeUrl)) {
      setError('The update link is unavailable right now. Please open the Play Store and update manually.');
      return;
    }
    try {
      await Linking.openURL(config.storeUrl);
    } catch {
      setError('Could not open the Play Store. Please open it and update manually.');
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View
        style={[
          styles.card,
          { opacity: card, transform: [{ scale: card.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] },
        ]}>
        <View style={styles.badgeWrap}>
          <Animated.View
            style={[
              styles.pulse,
              {
                opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
                transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }) }],
              },
            ]}
          />
          <View style={styles.badge}>
            <Heart size={44} color="#fff" />
          </View>
        </View>
        <Text style={styles.title}>Update Required</Text>
        <Text style={styles.message}>{config.message}</Text>
        <View style={styles.versions}>
          <View style={styles.col}>
            <Text style={styles.label}>YOUR VERSION</Text>
            <Text style={styles.value}>v{installed}</Text>
          </View>
          <ArrowRight size={20} color={colors.primary} />
          <View style={styles.col}>
            <Text style={styles.label}>LATEST VERSION</Text>
            <Text style={[styles.value, { color: colors.primary }]}>v{config.requiredVersion}</Text>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.btn} onPress={update}>
          <Text style={styles.btnText}>Update Now</Text>
        </Pressable>
        <Text style={styles.foot}>Get the latest version from the Play Store to continue.</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, backgroundColor: colors.primaryLight, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    ...shadow,
    elevation: 14,
  },
  badgeWrap: { position: 'absolute', top: -44, width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.primary },
  message: { fontSize: 15, lineHeight: 22, color: '#555', textAlign: 'center', marginTop: 8, marginBottom: 20 },
  versions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  col: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 0.6 },
  value: { fontSize: 20, fontWeight: '800', color: colors.text },
  error: { color: '#D32F2F', fontSize: 13, textAlign: 'center', marginBottom: 14 },
  btn: { alignSelf: 'stretch', backgroundColor: colors.primary, borderRadius: 26, paddingVertical: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  foot: { fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 14 },
});
