import React, { useState, createContext, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, VirtualizedList,
  Image, ScrollView, StyleSheet, Modal, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_NEWS = Array.from({ length: 55 }, (_, i) => ({
  id: String(i + 1),
  title: `Новина порталу #${i + 1}: Наукові та освітні події ЖДТУ`,
  category: ['Освіта та наука', 'Кібербезпека', 'Студентське життя'][i % 3],
  status: ['Опубліковано', 'Чернетка', 'На перевірці'][i % 3],
  imageUrl: `https://picsum.photos/seed/lab3n${i + 1}/600/320`,
  content: `Повний текст новини №${i + 1}. Державний університет «Житомирська політехніка» впроваджує сучасні цифрові рішення для студентів та викладачів.`,
  createdAt: `${(i % 28) + 1}.11.2026`,
}));

const INITIAL_USERS = Array.from({ length: 55 }, (_, i) => ({
  id: String(i + 1),
  name: i === 0 ? 'Куліш Марія Олександрівна' : `Студент / Редактор #${i + 1}`,
  email: i === 0 ? 'ipz243_kmo@student.ztu.edu.ua' : `user${i + 1}@student.ztu.edu.ua`,
  role: ['Адміністратор', 'Редактор', 'Модератор'][i % 3],
  status: i % 4 === 0 ? 'Заблокований' : 'Активний',
}));

const INITIAL_LOGS = Array.from({ length: 55 }, (_, i) => ({
  id: String(i + 1),
  action: 'Системна перевірка',
  details: `Аудит запису №${i + 1}`,
  timestamp: `21.11.2026 11:${String(i % 60).padStart(2, '0')}`,
}));

const AdminContext = createContext(null);

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [adminEmail, setAdminEmail] = useState('ipz243_kmo@student.ztu.edu.ua');
  const [news, setNews] = useState(INITIAL_NEWS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [filterSheetType, setFilterSheetType] = useState(null);
  const [newsStatusFilter, setNewsStatusFilter] = useState('Усі');
  const [userStatusFilter, setUserStatusFilter] = useState('Усі');

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Освіта та наука');
  const [formStatus, setFormStatus] = useState('Опубліковано');
  const [formImage, setFormImage] = useState('https://picsum.photos/seed/ztu/600/320');
  const [formContent, setFormContent] = useState('');

  const addLog = (action, details) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [{ id: String(Date.now() + Math.random()), action, details, timestamp: `21.11.2026 ${time}` }, ...prev]);
  };

  const handleLogin = () => {
    setIsAuth(true);
    addLog('Вхід у систему', `Адміністратор ${adminEmail} увійшов у панель`);
  };

  const handleLogout = () => {
    addLog('Вихід із системи', `Адміністратор ${adminEmail} вийшов із системи`);
    setDrawerOpen(false);
    setIsAuth(false);
  };

  const openEditor = (item = null) => {
    setEditingNews(item);
    setFormTitle(item ? item.title : '');
    setFormCategory(item ? item.category : 'Освіта та наука');
    setFormStatus(item ? item.status : 'Опубліковано');
    setFormImage(item ? item.imageUrl : 'https://picsum.photos/seed/newztu/600/320');
    setFormContent(item ? item.content : '');
    setEditorModalVisible(true);
  };

  const saveNews = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      Alert.alert('Помилка', 'Заповніть заголовок та текст новини');
      return;
    }
    if (editingNews) {
      setNews((prev) => prev.map((n) => (n.id === editingNews.id ? { ...n, title: formTitle, category: formCategory, status: formStatus, imageUrl: formImage, content: formContent } : n)));
      addLog('Редагування новини', `Оновлено новину: "${formTitle}"`);
    } else {
      const created = { id: String(Date.now()), title: formTitle, category: formCategory, status: formStatus, imageUrl: formImage, content: formContent, createdAt: '21.11.2026' };
      setNews((prev) => [created, ...prev]);
      addLog('Створення новини', `Створено новину: "${formTitle}"`);
    }
    setEditorModalVisible(false);
  };

  const confirmDeleteNews = (item) => {
    Alert.alert('Видалення новини', `Видалити "${item.title}"?`, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => {
          setNews((prev) => prev.filter((n) => n.id !== item.id));
          addLog('Видалення новини', `Видалено новину: "${item.title}"`);
          setSelectedNewsId(null);
        },
      },
    ]);
  };

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === 'Активний' ? 'Заблокований' : 'Активний';
          addLog('Зміна статусу користувача', `${u.name} -> ${next}`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  if (!isAuth) {
    return (
      <SafeAreaView style={styles.loginSafe}>
        <View style={styles.loginCard}>
          <Ionicons name="shield-checkmark" size={48} color="#1E4B94" style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={styles.loginTitle}>Адмін-панель порталу</Text>
          <Text style={styles.loginSub}>Лабораторна робота №3 • Куліш М.О., ІПЗ-24-3</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={adminEmail} onChangeText={setAdminEmail} />
          <Text style={styles.label}>Пароль</Text>
          <TextInput style={styles.input} value="123456" secureTextEntry />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryBtnText}>Увійти</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const filteredNews = news.filter((n) => newsStatusFilter === 'Усі' || n.status === newsStatusFilter);
  const filteredUsers = users.filter((u) => userStatusFilter === 'Усі' || u.status === userStatusFilter);
  const selectedNewsItem = news.find((n) => n.id === selectedNewsId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E4B94' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} style={{ marginRight: 14 }}>
          <Ionicons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeTab === 'dashboard' && 'Дашборд аналітики'}
          {activeTab === 'news' && 'Управління новинами'}
          {activeTab === 'users' && 'Користувачі'}
          {activeTab === 'logs' && 'Системні логи'}
        </Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
        {activeTab === 'dashboard' && (
          <ScrollView style={{ padding: 16 }}>
            <Text style={styles.sectionHeading}>Статистика порталу в реальному часі</Text>
            <View style={[styles.statBox, { borderLeftColor: '#1E4B94' }]}>
              <Text style={styles.statNum}>{news.length}</Text>
              <Text style={styles.statText}>Усього новин (Опубліковано: {news.filter((n) => n.status === 'Опубліковано').length})</Text>
            </View>
            <View style={[styles.statBox, { borderLeftColor: '#059669' }]}>
              <Text style={styles.statNum}>{users.length}</Text>
              <Text style={styles.statText}>Користувачів (Активних: {users.filter((u) => u.status === 'Активний').length})</Text>
            </View>
            <View style={[styles.statBox, { borderLeftColor: '#D97706' }]}>
              <Text style={styles.statNum}>{logs.length}</Text>
              <Text style={styles.statText}>Записів у системних логах</Text>
            </View>
          </ScrollView>
        )}

        {activeTab === 'news' && !selectedNewsItem && (
          <View style={{ flex: 1 }}>
            <View style={styles.toolbar}>
              <TouchableOpacity style={styles.primaryBtnSmall} onPress={() => openEditor(null)}>
                <Ionicons name="add" size={18} color="#FFF" />
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Створити новину</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterSheetType('news')}>
                <Ionicons name="filter" size={18} color="#1E4B94" />
                <Text style={{ color: '#1E4B94', fontWeight: '700' }}>Фільтр ({newsStatusFilter})</Text>
              </TouchableOpacity>
            </View>
            <VirtualizedList
              data={filteredNews}
              getItem={(data, i) => data[i]}
              getItemCount={(data) => data.length}
              getItemLayout={(_, i) => ({ length: 102, offset: 102 * i, index: i })}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.newsCard} onPress={() => setSelectedNewsId(item.id)}>
                  <Image source={{ uri: item.imageUrl }} style={{ width: 90, height: '100%' }} />
                  <View style={{ flex: 1, padding: 8, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, color: '#1E4B94', fontWeight: '700' }}>{item.category} • {item.status}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700' }} numberOfLines={2}>{item.title}</Text>
                    <Text style={{ fontSize: 11, color: '#6B7280' }}>{item.createdAt}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {activeTab === 'news' && selectedNewsItem && (
          <ScrollView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={styles.toolbar}>
              <TouchableOpacity onPress={() => setSelectedNewsId(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="arrow-back" size={20} color="#1E4B94" />
                <Text style={{ color: '#1E4B94', fontWeight: '700' }}>Назад</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={styles.primaryBtnSmall} onPress={() => openEditor(selectedNewsItem)}>
                  <Text style={{ color: '#FFF', fontWeight: '700' }}>Редагувати</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtnSmall, { backgroundColor: '#DC2626' }]} onPress={() => confirmDeleteNews(selectedNewsItem)}>
                  <Text style={{ color: '#FFF', fontWeight: '700' }}>Видалити</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image source={{ uri: selectedNewsItem.imageUrl }} style={{ width: '100%', height: 200 }} />
            <View style={{ padding: 16 }}>
              <Text style={{ color: '#1E4B94', fontWeight: '700', marginBottom: 6 }}>{selectedNewsItem.category} • {selectedNewsItem.status}</Text>
              <Text style={{ fontSize: 19, fontWeight: '700', marginBottom: 10 }}>{selectedNewsItem.title}</Text>
              <Text style={{ fontSize: 15, lineHeight: 22, color: '#374151' }}>{selectedNewsItem.content}</Text>
            </View>
          </ScrollView>
        )}

        {activeTab === 'users' && (
          <View style={{ flex: 1 }}>
            <View style={styles.toolbar}>
              <Text style={{ fontWeight: '700' }}>Усього: {filteredUsers.length}</Text>
              <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterSheetType('users')}>
                <Ionicons name="filter" size={18} color="#1E4B94" />
                <Text style={{ color: '#1E4B94', fontWeight: '700' }}>Фільтр ({userStatusFilter})</Text>
              </TouchableOpacity>
            </View>
            <VirtualizedList
              data={filteredUsers}
              getItem={(data, i) => data[i]}
              getItemCount={(data) => data.length}
              getItemLayout={(_, i) => ({ length: 82, offset: 82 * i, index: i })}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 12 }}
              renderItem={({ item }) => (
                <View style={styles.userCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>{item.email} ({item.role})</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: item.status === 'Активний' ? '#059669' : '#DC2626' }}>{item.status}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.filterBtn, { backgroundColor: item.status === 'Активний' ? '#FEE2E2' : '#D1FAE5' }]}
                    onPress={() => toggleUserStatus(item.id)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: item.status === 'Активний' ? '#DC2626' : '#059669' }}>
                      {item.status === 'Активний' ? 'Заблокувати' : 'Активувати'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        {activeTab === 'logs' && (
          <VirtualizedList
            data={logs}
            getItem={(data, i) => data[i]}
            getItemCount={(data) => data.length}
            getItemLayout={(_, i) => ({ length: 74, offset: 74 * i, index: i })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item }) => (
              <View style={styles.logCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: '700', color: '#1E4B94', fontSize: 13 }}>{item.action}</Text>
                  <Text style={{ fontSize: 11, color: '#6B7280' }}>{item.timestamp}</Text>
                </View>
                <Text style={{ fontSize: 12, color: '#374151', marginTop: 4 }} numberOfLines={1}>{item.details}</Text>
              </View>
            )}
          />
        )}
      </View>

      <Modal visible={drawerOpen} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <View style={styles.avatar}><Ionicons name="person" size={30} color="#1E4B94" /></View>
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Куліш Марія Олександрівна</Text>
              <Text style={{ color: '#DBEAFE', fontSize: 12 }}>{adminEmail}</Text>
            </View>
            <View style={{ flex: 1, paddingTop: 8 }}>
              {[
                { key: 'dashboard', label: 'Дашборд', icon: 'stats-chart-outline' },
                { key: 'news', label: 'Новини', icon: 'newspaper-outline' },
                { key: 'users', label: 'Користувачі', icon: 'people-outline' },
                { key: 'logs', label: 'Системні логи', icon: 'terminal-outline' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.drawerItem, activeTab === m.key && { backgroundColor: '#EFF6FF' }]}
                  onPress={() => { setActiveTab(m.key); setSelectedNewsId(null); setDrawerOpen(false); }}
                >
                  <Ionicons name={m.icon} size={22} color={activeTab === m.key ? '#1E4B94' : '#374151'} />
                  <Text style={{ fontWeight: activeTab === m.key ? '700' : '500', color: activeTab === m.key ? '#1E4B94' : '#374151' }}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#DC2626" />
              <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 16 }}>Вийти</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setDrawerOpen(false)} />
        </View>
      </Modal>

      <Modal visible={editorModalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setEditorModalVisible(false)} style={{ marginRight: 14 }}>
              <Ionicons name="close" size={26} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{editingNews ? 'Редагувати новину' : 'Створити новину'}</Text>
          </View>
          <ScrollView style={{ padding: 16 }}>
            <Text style={styles.label}>Заголовок</Text>
            <TextInput style={styles.input} value={formTitle} onChangeText={setFormTitle} />
            <Text style={styles.label}>Категорія</Text>
            <TextInput style={styles.input} value={formCategory} onChangeText={setFormCategory} />
            <Text style={styles.label}>Статус</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {['Опубліковано', 'Чернетка', 'На перевірці'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[styles.filterBtn, formStatus === st && { backgroundColor: '#1E4B94' }]}
                  onPress={() => setFormStatus(st)}
                >
                  <Text style={{ color: formStatus === st ? '#FFF' : '#1E4B94', fontSize: 12, fontWeight: '700' }}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>URL зображення</Text>
            <TextInput style={styles.input} value={formImage} onChangeText={setFormImage} />
            <Text style={styles.label}>Текст новини</Text>
            <TextInput style={[styles.input, { height: 100 }]} value={formContent} onChangeText={setFormContent} multiline />
            <TouchableOpacity style={styles.primaryBtn} onPress={saveNews}>
              <Text style={styles.primaryBtnText}>Зберегти</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!filterSheetType} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', marginBottom: 14 }}>
              {filterSheetType === 'users' ? 'Фільтр користувачів' : 'Фільтр новин'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {(filterSheetType === 'users' ? ['Усі', 'Активний', 'Заблокований'] : ['Усі', 'Опубліковано', 'Чернетка', 'На перевірці']).map((st) => {
                const active = filterSheetType === 'users' ? userStatusFilter === st : newsStatusFilter === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.filterBtn, active && { backgroundColor: '#1E4B94' }]}
                    onPress={() => {
                      if (filterSheetType === 'users') setUserStatusFilter(st);
                      else setNewsStatusFilter(st);
                    }}
                  >
                    <Text style={{ color: active ? '#FFF' : '#1E4B94', fontWeight: '700' }}>{st}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setFilterSheetType(null)}>
              <Text style={styles.primaryBtnText}>Застосувати</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginSafe: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  loginCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, elevation: 4 },
  loginTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', color: '#111827' },
  loginSub: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: 20, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, marginBottom: 14, backgroundColor: '#F9FAFB' },
  primaryBtn: { backgroundColor: '#1E4B94', padding: 14, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  primaryBtnSmall: { flexDirection: 'row', backgroundColor: '#1E4B94', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 4 },
  filterBtn: { flexDirection: 'row', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 4 },
  header: { height: 56, backgroundColor: '#1E4B94', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  sectionHeading: { fontSize: 18, fontWeight: '700', marginBottom: 14, color: '#111827' },
  statBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 5, elevation: 2 },
  statNum: { fontSize: 26, fontWeight: '800', color: '#111827' },
  statText: { fontSize: 14, color: '#4B5563', marginTop: 4 },
  newsCard: { height: 90, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 10, flexDirection: 'row', overflow: 'hidden', elevation: 2 },
  userCard: { height: 70, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  logCard: { height: 62, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 10, padding: 10, justifyContent: 'center', elevation: 1 },
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
  drawer: { width: 270, backgroundColor: '#FFF', height: '100%' },
  drawerHeader: { backgroundColor: '#1E4B94', padding: 20, paddingTop: 30 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderColor: '#E5E7EB', gap: 10 },
});