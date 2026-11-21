import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('Куліш Марія Олександрівна');
  const [email, setEmail] = useState('ipz243_kmo@student.ztu.edu.ua');
  const [group, setGroup] = useState('ІПЗ-24-3');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.banner}>
        <View style={styles.bannerActions}>
          <TouchableOpacity
            style={styles.actionCircle}
            onPress={() => {
              setFullName('Куліш Марія Олександрівна');
              setEmail('ipz243_kmo@student.ztu.edu.ua');
              setGroup('ІПЗ-24-3');
            }}
          >
            <Ionicons name="close" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCircle}
            onPress={() => Alert.alert('Збережено', 'Дані профілю оновлено')}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={64} color="#6B7280" />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>ПІБ</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>КОНТАКТИ</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput style={[styles.input, { marginBottom: 12 }]} value={email} onChangeText={setEmail} />
        <Text style={styles.label}>Група</Text>
        <TextInput style={styles.input} value={group} onChangeText={setGroup} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>НАЛАШТУВАННЯ</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={22} color="#1E4B94" />
            <Text style={styles.settingText}>Сповіщення</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={notificationsEnabled ? '#1E4B94' : '#F3F4F6'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  contentContainer: { paddingBottom: 24 },
  banner: { height: 110, backgroundColor: '#1E4B94', paddingHorizontal: 16, paddingTop: 14, alignItems: 'flex-end' },
  bannerActions: { flexDirection: 'row', gap: 10 },
  actionCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarWrapper: { alignItems: 'center', marginTop: -55, marginBottom: 14 },
  avatarCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E5E7EB', borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  fieldGroup: { paddingHorizontal: 16, marginBottom: 14 },
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 14, borderRadius: 12, padding: 16, elevation: 2 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#111827' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingText: { fontSize: 15, fontWeight: '600', color: '#111827' },
});