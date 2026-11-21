import React from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';

export default function SettingsScreen() {
  const { score, tasks, soundHints, setSoundHints, autoResetCombo, setAutoResetCombo, resetProgress } = useGame();

  const handleReset = () => {
    Alert.alert(
      'Скидання прогресу',
      'Ви дійсно бажаєте обнулити всі очки та прогрес виконання завдань?',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Скинути', style: 'destructive', onPress: resetProgress },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Інформація про додаток</Text>
        <Text style={styles.rowText}>Назва: Clicker (Лабораторна робота №4)</Text>
        <Text style={styles.rowText}>Виконала: Куліш Марія Олександрівна, ІПЗ-24-3</Text>
        <Text style={styles.rowText}>Поточний рахунок: {score} очок</Text>
        <Text style={styles.rowText}>
          Виконано завдань: {tasks.filter((t) => t.completed).length} / {tasks.length}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Параметри взаємодії</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Текстові сповіщення про жести</Text>
          <Switch value={soundHints} onValueChange={setSoundHints} trackColor={{ true: '#1E4B94' }} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Підсвічування активних комбо</Text>
          <Switch value={autoResetCombo} onValueChange={setAutoResetCombo} trackColor={{ true: '#1E4B94' }} />
        </View>
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Ionicons name="refresh-circle-outline" size={22} color="#FFFFFF" />
        <Text style={styles.resetBtnText}>Скинути весь прогрес</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 14, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E4B94', marginBottom: 10 },
  rowText: { fontSize: 14, color: '#374151', marginBottom: 6 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  switchLabel: { fontSize: 14, color: '#111827', flex: 1 },
  resetBtn: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  resetBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});