import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';

export default function TasksScreen() {
  const { tasks } = useGame();
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.summary}>
          Виконано завдань: {completedCount} із {tasks.length}
        </Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.completed && styles.taskCardDone]}>
            <Ionicons
              name={item.completed ? 'checkmark-circle' : 'time-outline'}
              size={28}
              color={item.completed ? '#059669' : '#D97706'}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.progress}>Прогрес: {item.progress}</Text>
                <Text style={[styles.badge, { color: item.completed ? '#059669' : '#D97706' }]}>
                  {item.completed ? 'Виконано' : 'В процесі'}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerBox: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summary: { fontSize: 16, fontWeight: '700', color: '#111827', textAlign: 'center' },
  list: { padding: 14 },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  taskCardDone: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#111827' },
  desc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progress: { fontSize: 12, fontWeight: '600', color: '#374151' },
  badge: { fontSize: 12, fontWeight: '700' },
});