import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';

export default function DashboardScreen() {
  const { news, users, logs } = useAdmin();
  const [stats, setStats] = useState({
    newsCount: 0,
    publishedNews: 0,
    usersCount: 0,
    activeUsers: 0,
    logsCount: 0,
    lastUpdated: '',
  });

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      setStats({
        newsCount: news.length,
        publishedNews: news.filter((n) => n.status === 'Опубліковано').length,
        usersCount: users.length,
        activeUsers: users.filter((u) => u.status === 'Активний').length,
        logsCount: logs.length,
        lastUpdated: now.toLocaleTimeString(),
      });
    }, [news, users, logs])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Зведена аналітика порталу</Text>
      <Text style={styles.syncInfo}>Оновлено при фокусі екрана: {stats.lastUpdated}</Text>

      <View style={[styles.statCard, { borderLeftColor: '#1E4B94' }]}>
        <View style={styles.row}>
          <Ionicons name="newspaper" size={32} color="#1E4B94" />
          <View style={styles.info}>
            <Text style={styles.statValue}>{stats.newsCount}</Text>
            <Text style={styles.statLabel}>Усього новин у базі</Text>
            <Text style={styles.subLabel}>Опубліковано: {stats.publishedNews}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.statCard, { borderLeftColor: '#059669' }]}>
        <View style={styles.row}>
          <Ionicons name="people" size={32} color="#059669" />
          <View style={styles.info}>
            <Text style={styles.statValue}>{stats.usersCount}</Text>
            <Text style={styles.statLabel}>Зареєстрованих користувачів</Text>
            <Text style={styles.subLabel}>Активних акаунтів: {stats.activeUsers}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.statCard, { borderLeftColor: '#D97706' }]}>
        <View style={styles.row}>
          <Ionicons name="shield-checkmark" size={32} color="#D97706" />
          <View style={styles.info}>
            <Text style={styles.statValue}>{stats.logsCount}</Text>
            <Text style={styles.statLabel}>Записів у системному журналі</Text>
            <Text style={styles.subLabel}>Остання подія: {logs[0]?.action}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '700', color: '#111827' },
  syncInfo: { fontSize: 12, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 5,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  info: { flex: 1 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 15, fontWeight: '600', color: '#374151', marginTop: 2 },
  subLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
});