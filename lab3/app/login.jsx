import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../context/AdminContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('ipz243_kmo@student.ztu.edu.ua');
  const [password, setPassword] = useState('admin123');
  const { login } = useAdmin();
  const router = useRouter();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Помилка', 'Заповніть усі поля для входу');
      return;
    }
    login(email);
    router.replace('/(admin)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Ionicons name="lock-closed" size={36} color="#1E4B94" />
          </View>
          <Text style={styles.title}>Панель адміністратора</Text>
          <Text style={styles.subtitle}>Лабораторна робота №3 • Куліш М.О., ІПЗ-24-3</Text>

          <Text style={styles.label}>Email адміністратора</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

          <Text style={styles.label}>Пароль</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Увійти в адмін-панель</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, elevation: 4 },
  iconBox: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 4, marginBottom: 22 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, marginBottom: 16,
  },
  btn: { backgroundColor: '#1E4B94', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});