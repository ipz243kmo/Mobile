import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Switch, StyleSheet,
  SafeAreaView, Alert, Animated, PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [activeTab, setActiveTab] = useState('clicker'); // clicker | tasks | settings
  const [score, setScore] = useState(0);
  const [lastEvent, setLastEvent] = useState('Натисніть, утримайте або перетягніть сферу!');

  const [singleTaps, setSingleTaps] = useState(0);
  const [doubleTaps, setDoubleTaps] = useState(0);
  const [longPresses, setLongPresses] = useState(0);
  const [pans, setPans] = useState(0);
  const [flingRight, setFlingRight] = useState(false);
  const [flingLeft, setFlingLeft] = useState(false);
  const [pinches, setPinches] = useState(0);

  const [comboStepOne, setComboStepOne] = useState(false);
  const [comboDone, setComboDone] = useState(false);
  const [orbScale, setOrbScale] = useState(1);
  const [hintsEnabled, setHintsEnabled] = useState(true);

  const pan = useRef(new Animated.ValueXY()).current;
  const lastTapRef = useRef(0);
  const longPressTimer = useRef(null);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double Tap
      setScore((s) => s + 2);
      setDoubleTaps((c) => c + 1);
      setComboStepOne(true);
      setLastEvent('Подвійний клік (Double Tap): +2 очки (Крок 1 комбо!)');
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      setScore((s) => s + 1);
      setSingleTaps((c) => c + 1);
      setLastEvent('Одиночний клік (Tap): +1 очко');
    }
  };

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      setScore((s) => s + 5);
      setLongPresses((c) => c + 1);
      if (comboStepOne) {
        setComboDone(true);
        setScore((s) => s + 10);
        setLastEvent('Утримання 3с + Комбо (2x Tap -> LongPress): +15 очок!');
      } else {
        setLastEvent('Утримання об’єкта 3 секунди (LongPress): +5 очок');
      }
    }, 3000);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startLongPress();
      },
      onPanResponderMove: (_, gesture) => {
        if (Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10) {
          cancelLongPress();
        }
        pan.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        cancelLongPress();
        // Перевірка Fling (швидкий свайп)
        if (Math.abs(gesture.vx) > 1.2 && Math.abs(gesture.dx) > 60) {
          const bonus = Math.floor(Math.random() * 10) + 1;
          setScore((s) => s + bonus);
          if (gesture.dx > 0) {
            setFlingRight(true);
            setLastEvent(`Швидкий свайп вправо (Fling): +${bonus} очок`); } else { setFlingLeft(true); setLastEvent(`Швидкий свайп вліво (Fling): +${bonus} очок`);
          }
        } else if (Math.abs(gesture.dx) > 15 || Math.abs(gesture.dy) > 15) {
          // Pan (перетягування)
          setScore((s) => s + 1);
          setPans((c) => c + 1);
          setLastEvent('Перетягування об’єкта (Pan): +1 очко');
        } else {
          // Tap / Double Tap
          handleTap();
        }
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const triggerPinchDemo = (delta) => {
    const nextScale = Math.min(Math.max(orbScale + delta, 0.75), 1.45);
    setOrbScale(nextScale);
    setScore((s) => s + 3);
    setPinches((c) => c + 1);
    setLastEvent('Масштабування об’єкта (Pinch): +3 бонусних очки');
  };

  const resetAll = () => {
    setScore(0);
    setSingleTaps(0);
    setDoubleTaps(0);
    setLongPresses(0);
    setPans(0);
    setFlingRight(false);
    setFlingLeft(false);
    setPinches(0);
    setComboStepOne(false);
    setComboDone(false);
    setOrbScale(1);
    setLastEvent('Прогрес скинуто!');
  };

  const tasks = [
    { id: '1', title: 'Зробити 10 кліків', progress: `${Math.min(singleTaps, 10)} / 10`, done: singleTaps >= 10 }, { id: '2', title: 'Зробити подвійний клік 5 разів', progress: `${Math.min(doubleTaps, 5)} / 5`, done: doubleTaps >= 5 },
    { id: '3', title: 'Утримувати об’єкт 3 секунди', progress: `${Math.min(longPresses, 1)} / 1`, done: longPresses >= 1 }, { id: '4', title: 'Перетягнути об’єкт', progress: `${Math.min(pans, 1)} / 1`, done: pans >= 1 },
    { id: '5', title: 'Зробити свайп вправо та вліво', progress: `Вправо: ${flingRight ? '✓' : '—'} \vert{} Вліво: ${flingLeft ? '✓' : '—'}`, done: flingRight && flingLeft },
    { id: '6', title: 'Змінити розмір об’єкта (Pinch)', progress: `${Math.min(pinches, 1)} / 1`, done: pinches >= 1 }, { id: '7', title: 'Отримати 100 очок', progress: `${Math.min(score, 100)} / 100`, done: score >= 100 },
    { id: '8', title: 'Комбо: Подвійний клік + Утримання 3 с', progress: comboDone ? 'Виконано!' : comboStepOne ? 'Крок 1/2' : '0 / 2', done: comboDone },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E4B94' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === 'clicker' && 'Clicker • Лабораторна робота №4'}
          {activeTab === 'tasks' && 'Завдання та досягнення'}
          {activeTab === 'settings' && 'Налаштування'}
        </Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
        {activeTab === 'clicker' && (
          <View style={{ flex: 1 }}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>РАХУНОК ОЧОК</Text>
              <Text style={styles.scoreVal}>{score}</Text>
              {hintsEnabled && <Text style={styles.eventText}>{lastEvent}</Text>}
            </View>

            <View style={styles.arena}>
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.orb,
                  { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: orbScale }] },
                ]}
              >
                <Ionicons name="sparkles" size={42} color="#FFF" />
                <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 17, marginTop: 4 }}>CLICKER</Text>
                <Text style={{ color: '#DBEAFE', fontSize: 10 }}>Tap • 2x • 3с • Pan • Fling</Text>
              </Animated.View>
            </View>

            <View style={styles.pinchBar}>
              <Text style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>Масштабування (PinchGestureHandler):</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={styles.pinchBtn} onPress={() => triggerPinchDemo(-0.15)}>
                  <Ionicons name="remove-circle-outline" size={18} color="#1E4B94" />
                  <Text style={styles.pinchBtnText}>Зменшити (+3)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pinchBtn} onPress={() => triggerPinchDemo(0.15)}>
                  <Ionicons name="add-circle-outline" size={18} color="#1E4B94" />
                  <Text style={styles.pinchBtnText}>Збільшити (+3)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'tasks' && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 14 }}
            ListHeaderComponent={
              <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>
                Виконано: {tasks.filter((t) => t.done).length} із {tasks.length}
              </Text>
            }
            renderItem={({ item }) => (
              <View style={[styles.taskCard, item.done && { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', borderWidth: 1 }]}>
                <Ionicons name={item.done ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={item.done ? '#059669' : '#9CA3AF'} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 14 }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{item.progress}</Text>
                </View>
                <Text style={{ fontWeight: '700', fontSize: 12, color: item.done ? '#059669' : '#D97706' }}>
                  {item.done ? 'Виконано' : 'В процесі'}
                </Text>
              </View>
            )}
          />
        )}

        {activeTab === 'settings' && (
          <View style={{ padding: 16 }}>
            <View style={styles.card}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: '#1E4B94', marginBottom: 8 }}>Параметри додатку</Text>
              <Text style={{ marginBottom: 4 }}>Студентка: Куліш Марія Олександрівна (ІПЗ-24-3)</Text>
              <Text style={{ marginBottom: 12 }}>Поточний рахунок: {score} очок</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Показувати підказки жестів</Text>
                <Switch value={hintsEnabled} onValueChange={setHintsEnabled} />
              </View>
            </View>
            <TouchableOpacity style={styles.resetBtn} onPress={resetAll}>
              <Ionicons name="refresh" size={20} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Скинути прогрес</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Tabs */}
      <View style={styles.tabBar}>
        {[
          { key: 'clicker', label: 'Клікер', icon: 'hand-left-outline' },
          { key: 'tasks', label: 'Завдання', icon: 'checkbox-outline' },
          { key: 'settings', label: 'Налаштування', icon: 'settings-outline' },
        ].map((t) => (
          <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setActiveTab(t.key)}>
            <Ionicons name={t.icon} size={22} color={activeTab === t.key ? '#1E4B94' : '#6B7280'} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: activeTab === t.key ? '#1E4B94' : '#6B7280' }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { height: 54, backgroundColor: '#1E4B94', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  scoreBox: { backgroundColor: '#FFF', padding: 14, alignItems: 'center', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  scoreLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  scoreVal: { fontSize: 42, fontWeight: '800', color: '#1E4B94' },
  eventText: { fontSize: 12, color: '#059669', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 4 },
  arena: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orb: {
    width: 150, height: 150, borderRadius: 75, backgroundColor: '#1E4B94',
    justifyContent: 'center', alignItems: 'center', elevation: 6, borderWidth: 4, borderColor: '#93C5FD',
  },
  pinchBar: { backgroundColor: '#FFF', padding: 12, alignItems: 'center', borderTopWidth: 1, borderColor: '#E5E7EB' },
  pinchBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 4 },
  pinchBtnText: { color: '#1E4B94', fontWeight: '700', fontSize: 13 },
  taskCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 14, borderRadius: 12, marginBottom: 10, alignItems: 'center', gap: 12, elevation: 1 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 14 },
  resetBtn: { flexDirection: 'row', backgroundColor: '#DC2626', padding: 14, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 8 },
  tabBar: { flexDirection: 'row', height: 58, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E5E7EB' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});