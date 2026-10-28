import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, shadow } from '../theme';
import AppModal from '../components/AppModal';
import { fmtPeriod, fmtTime, saveSession } from '../storage';
import {
  ArrowRight,
  BarsIcon,
  ClockIcon,
  CloseCircle,
  FootIcon,
  Heart,
  InfoIcon,
  ResetIcon,
  TimerIcon,
} from '../components/Icons';

const MAX_KICKS = 10;
const CIRCLE = 236;
const RING = 304;
const RING_R = 144;

type Props = { onOpenHistory: () => void; onSaved: () => void };

const polar = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: RING / 2 + RING_R * Math.cos(a), y: RING / 2 + RING_R * Math.sin(a) };
};
const SEGMENTS = Array.from({ length: MAX_KICKS }, (_, i) => {
  const step = 360 / MAX_KICKS;
  const s = polar(-90 + i * step + 4);
  const e = polar(-90 + (i + 1) * step - 4);
  return `M${s.x} ${s.y} A${RING_R} ${RING_R} 0 0 1 ${e.x} ${e.y}`;
});

const BUBBLES = [
  { size: 90, left: '8%', top: 70, delay: 0 },
  { size: 46, left: '78%', top: 40, delay: 600 },
  { size: 64, left: '84%', top: 150, delay: 1200 },
  { size: 34, left: '22%', top: 170, delay: 300 },
  { size: 54, left: '55%', top: 20, delay: 900 },
] as const;

function Bubble({ size, left, top, delay }: (typeof BUBBLES)[number]) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(255,255,255,0.14)',
        transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) }],
      }}
    />
  );
}

function FloatingHeart({ dx, onDone }: { dx: number; onDone: () => void }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(onDone);
  }, [v, onDone]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        opacity: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0.9, 0] }),
        transform: [
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -190] }) },
          { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
          { scale: v.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.4, 1.1, 0.8] }) },
        ],
      }}>
      <Heart size={30} color={colors.primary} />
    </Animated.View>
  );
}

const greeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good Morning, Mom 🌅';
  if (h >= 12 && h < 17) return 'Good Afternoon, Mom ☀️';
  if (h >= 17 && h < 21) return 'Good Evening, Mom 🌇';
  return 'Good Night, Mom 🌙';
};

const message = (count: number) => {
  if (count === 0) return 'Tap the icon above when your baby kicks';
  if (count < 5) return 'Beautiful! Keep counting 💗';
  if (count < MAX_KICKS - 1) return `Almost there — ${MAX_KICKS - count} more to go`;
  return 'Just one more kick!';
};

export default function HomeScreen({ onOpenHistory, onSaved }: Props) {
  const { width } = useWindowDimensions();
  const [count, setCount] = useState(0);
  const [first, setFirst] = useState<number | null>(null);
  const [last, setLast] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [done, setDone] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mid, setMid] = useState({ y: 0, h: 0 });
  const [hearts, setHearts] = useState<{ id: number; dx: number }[]>([]);
  const heartId = useRef(0);

  const scale = useRef(new Animated.Value(1)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const idle = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const intro = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;
  const resetIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(intro, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idle, { toValue: 1, duration: 1700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(idle, { toValue: 0, duration: 1700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    const spin = Animated.loop(Animated.timing(orbit, { toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: true }));
    spin.start();
    return () => {
      loop.stop();
      spin.stop();
    };
  }, [idle, intro, orbit]);

  useEffect(() => {
    Animated.spring(resetIn, { toValue: count > 0 ? 1 : 0, friction: 6, useNativeDriver: true }).start();
  }, [count, resetIn]);

  useEffect(() => {
    if (first === null || done) return;
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, [first, done]);

  const onTap = () => {
    if (done) return;
    const t = Date.now();
    const next = count + 1;
    if (first === null) setFirst(t);
    setLast(t);
    setNow(t);
    setCount(next);
    setHearts(h => [...h, { id: heartId.current++, dx: (Math.random() - 0.5) * 120 }]);

    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }),
    ]).start();
    ripple.setValue(0);
    Animated.timing(ripple, { toValue: 1, duration: 750, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    pop.setValue(0.5);
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }).start();

    if (next >= MAX_KICKS) setTimeout(() => setDone(true), 450);
  };

  const reset = () => {
    setCount(0);
    setFirst(null);
    setLast(null);
    setDone(false);
  };

  const closeAndSave = async () => {
    if (first !== null && last !== null) {
      await saveSession({ id: String(first), date: new Date(first).toISOString(), first, last, count });
      onSaved();
    }
    reset();
  };

  const cy = mid.y + mid.h / 2;
  const headerH = cy + 30;
  const ringScale = ripple.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const ringOpacity = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });
  const idleScale = idle.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const idleOpacity = idle.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.08] });
  const rise = (d: number) => ({
    opacity: intro,
    transform: [{ translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [d, 0] }) }],
  });

  const tile = (icon: React.ReactNode, label: string, value: string, accent = false) => (
    <View style={[styles.tile, accent && styles.tileAccent]}>
      <View style={styles.tileIcon}>{icon}</View>
      <Text style={[styles.statValue, accent && { color: colors.primaryDark }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={width} height={headerH}>
          <Defs>
            <LinearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#F4A0AC" />
              <Stop offset="1" stopColor="#E2677D" />
            </LinearGradient>
          </Defs>
          <Path d={`M0 0 H${width} V${headerH - 70} Q${width / 2} ${headerH + 30} 0 ${headerH - 70} Z`} fill="url(#hg)" />
        </Svg>
        {BUBBLES.map((b, i) => (
          <Bubble key={i} {...b} />
        ))}
      </View>

      <View style={styles.bar}>
        <View style={styles.barSide} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.brand}>{greeting()}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
          </Text>
        </View>
        <View style={[styles.barSide, { alignItems: 'flex-end' }]}>
          <Pressable onPress={() => setShowInfo(true)} hitSlop={8} style={styles.roundBtn}>
            <InfoIcon size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={styles.center} onLayout={e => setMid({ y: e.nativeEvent.layout.y, h: e.nativeEvent.layout.height })}>
        <View style={styles.ringBox}>
          <Animated.View style={[styles.pulse, { opacity: idleOpacity, transform: [{ scale: idleScale }] }]} />
          <Animated.View style={[styles.pulse, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
          <Svg width={RING} height={RING} style={StyleSheet.absoluteFill}>
            {SEGMENTS.map((d, i) => (
              <Path
                key={i}
                d={d}
                stroke={i < count ? colors.primaryDark : '#F6D5DA'}
                strokeWidth={9}
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </Svg>
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { transform: [{ rotate: orbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] },
            ]}>
            <View style={styles.orbitDot} />
          </Animated.View>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable onPress={onTap} style={styles.circle} android_ripple={{ color: colors.primaryLight, radius: CIRCLE / 2 }}>
              {count === 0 ? (
                <FootIcon size={140} color={colors.primary} />
              ) : (
                <Animated.View style={{ alignItems: 'center', transform: [{ scale: pop }] }}>
                  <Text style={styles.big}>{count}</Text>
                  <Text style={styles.kicks}>{count === 1 ? 'Kick' : 'Kicks'}</Text>
                  <Text style={styles.of}>of {MAX_KICKS}</Text>
                </Animated.View>
              )}
            </Pressable>
          </Animated.View>
          {hearts.map(h => (
            <FloatingHeart key={h.id} dx={h.dx} onDone={() => setHearts(list => list.filter(x => x.id !== h.id))} />
          ))}
        </View>
        <Animated.View
          pointerEvents={count > 0 ? 'auto' : 'none'}
          style={[styles.resetWrap, { opacity: resetIn, transform: [{ scale: resetIn }] }]}>
          <Pressable onPress={() => setShowReset(true)} hitSlop={10} style={styles.resetBtn}>
            <ResetIcon size={24} color={colors.primaryDark} />
          </Pressable>
          <Text style={styles.resetLabel}>Reset</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.msgPill, rise(20)]}>
        <Text style={styles.msg}>{message(count)}</Text>
      </Animated.View>

      <Animated.View style={[styles.tiles, rise(40)]}>
        {tile(<ClockIcon color={colors.primary} />, 'SESSION', first ? fmtTime(first) : '--')}
        {tile(<TimerIcon color={colors.primary} />, 'PERIOD', first ? fmtPeriod(first, now) : '--')}
        {tile(<ClockIcon color={colors.primary} />, 'LAST', last ? fmtTime(last) : '--')}
        {tile(<Heart size={20} color={colors.primary} />, 'COUNT', String(count), true)}
      </Animated.View>

      <Animated.View style={rise(60)}>
        <Pressable style={[styles.card, styles.historyRow]} onPress={onOpenHistory}>
          <View style={styles.historyIcon}>
            <BarsIcon size={20} color={colors.primary} />
          </View>
          <Text style={styles.historyText}>Baby Kicks History</Text>
          <ArrowRight color={colors.primary} />
        </Pressable>
      </Animated.View>

      <AppModal
        visible={done}
        icon={<Heart size={52} color={colors.primary} />}
        title="Awesome!"
        message="Your baby is moving just fine"
        sub={`${MAX_KICKS} kicks in ${first && last ? fmtPeriod(first, last) : '0h 0m'}`}
        actions={[{ label: 'Close', onPress: closeAndSave }]}
        onRequestClose={closeAndSave}
      />
      <AppModal
        visible={showReset}
        icon={<CloseCircle size={50} color={colors.primary} />}
        title="Reset count?"
        message="The kicks counted in this session will be discarded and the counter will start again from 0."
        actions={[
          { label: 'Cancel', secondary: true, onPress: () => setShowReset(false) },
          { label: 'Reset', onPress: () => { setShowReset(false); reset(); } },
        ]}
        onRequestClose={() => setShowReset(false)}
      />
      <AppModal
        visible={showInfo}
        icon={<InfoIcon size={46} color={colors.primary} />}
        title="How it works"
        message={`Tap the foot icon every time you feel your baby kick. When you reach ${MAX_KICKS} kicks the session is complete and saved to your history.`}
        sub="Contact your doctor if you notice a change in your baby's movement pattern."
        actions={[{ label: 'Got it', onPress: () => setShowInfo(false) }]}
        onRequestClose={() => setShowInfo(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  bar: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  barSide: { width: 48 },
  brand: { color: '#fff', fontSize: 19, fontWeight: '800', letterSpacing: 0.3 },
  date: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 2 },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: RING },
  ringBox: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  pulse: {
    position: 'absolute',
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.primary,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadow,
    shadowOpacity: 0.18,
    elevation: 8,
  },
  big: { fontSize: 84, fontWeight: '800', color: colors.primary, lineHeight: 92 },
  kicks: { fontSize: 22, fontWeight: '700', color: colors.primary, marginTop: -4 },
  of: { fontSize: 13, fontWeight: '600', color: colors.muted, marginTop: 2 },
  msgPill: {
    alignSelf: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  msg: { color: colors.primaryDark, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    ...shadow,
    shadowOpacity: 0.08,
    elevation: 2,
  },
  tiles: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 10 },
  tile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    ...shadow,
    shadowOpacity: 0.08,
    elevation: 2,
  },
  tileAccent: { backgroundColor: colors.primaryLight },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDEFF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  orbitDot: {
    position: 'absolute',
    top: RING / 2 - RING_R - 7,
    left: RING / 2 - 7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  resetWrap: { position: 'absolute', right: 20, bottom: 6, alignItems: 'center' },
  resetBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
    elevation: 5,
  },
  resetLabel: { marginTop: 4, fontSize: 12, fontWeight: '800', color: colors.primaryDark },
  statLabel: { fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginTop: 2 },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  historyRow: { justifyContent: 'flex-start', paddingHorizontal: 16, paddingVertical: 14 },
  historyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: { flex: 1, marginLeft: 14, fontSize: 16, fontWeight: '700', color: '#555' },
});
