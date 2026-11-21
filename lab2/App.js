import React, { useState, useCallback, createContext, useContext, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SectionList,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ALL_NEWS = Array.from({ length: 120 }, (_, index) => {
  const id = String(index + 1);
  return {
    id,
    title: `Новина #${id}: Події та наукові досягнення Житомирської політехніки`,
    date: `${(index % 28) + 1} листопада 2026 р.`,
    category: index % 2 === 0 ? 'Освіта та наука' : 'Студентське життя',
    content: `Повний текст новини №${id}.\n\nДержавний університет «Житомирська політехніка» продовжує активно розвивати інноваційну інфраструктуру, міжнародну співпрацю та сучасні освітні програми для студентів факультету інформаційно-комп'ютерних технологій.\n\nУ межах заходу учасники мали змогу обговорити актуальні тренди розробки мобільних застосунків, кібербезпеки та штучного інтелекту.`,
    image: `https://picsum.photos/seed/ztunews${id}/600/300`,
  };
});

const FAQ_SECTIONS = [
  {
    title: '1. Навчальний процес та розклад',
    data: [
      {
        id: 'q1',
        question: 'Де переглянути актуальний розклад занять?',
        answer: 'Актуальний розклад доступний в електронному кабінеті студента на порталі Житомирської політехніки.',
      },
      {
        id: 'q2',
        question: 'Як отримати доступ до навчальних матеріалів?',
        answer: 'Усі методичні вказівки, лекції та завдання лабораторних робіт розміщуються на освітньому порталі кафедри.',
      },
    ],
  },
  {
    title: '2. Технічна підтримка та пошта',
    data: [
      {
        id: 'q3',
        question: 'Як відновити пароль від пошти @student.ztu.edu.ua?',
        answer: 'Зверніться до інформаційно-обчислювального центру університету або через куратора академічної групи.',
      },
      {
        id: 'q4',
        question: 'Як оновити стрічку новин?',
        answer: 'Потягніть список новин вниз (жест Pull-to-Refresh).',
      },
    ],
  },
];

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const login = (email) => {
    setUserEmail(email || 'ipz243_kmo@student.ztu.edu.ua');
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserEmail('');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

const ITEM_HEIGHT = 136;

const NewsCard = memo(function NewsCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item.id)} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
});

function LoginScreen() {
  const [email, setEmail] = useState('ipz243_kmo@student.ztu.edu.ua');
  const [password, setPassword] = useState('123456');
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Помилка', 'Введіть email та пароль');
      return;
    }
    login(email);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="school" size={40} color="#1E4B94" />
          </View>
          <Text style={styles.loginTitle}>Вхід у систему</Text>
          <Text style={styles.loginSubtitle}>Лабораторна робота №2 • Куліш М.О., ІПЗ-24-3</Text>

          <Text style={styles.label}>Корпоративний Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

          <Text style={styles.label}>Пароль</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Увійти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function NewsListScreen({ onSelectNews }) {
  const [displayedCount, setDisplayedCount] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const visibleData = ALL_NEWS.slice(0, displayedCount);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setDisplayedCount(20);
      setRefreshing(false);
    }, 800);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || displayedCount >= ALL_NEWS.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + 20, ALL_NEWS.length));
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, displayedCount]);

  const getItemLayout = useCallback(
    (_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }),
    []
  );

  const renderItem = useCallback(
    ({ item }) => <NewsCard item={item} onPress={onSelectNews} />,
    [onSelectNews]
  );

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.counterText}>
            Показано {visibleData.length} із {ALL_NEWS.length} новин
          </Text>
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" color="#1E4B94" style={{ marginVertical: 14 }} /> : null
        }
      />
    </View>
  );
}

function NewsDetailScreen({ id, onBack }) {
  const newsItem = ALL_NEWS.find((item) => item.id === String(id));

  if (!newsItem) {
    return (
      <View style={styles.center}>
        <Text>Новину з ID {id} не знайдено.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.detailContainer} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#1E4B94" />
        <Text style={styles.backText}>Назад до списку новин</Text>
      </TouchableOpacity>

      <Image source={{ uri: newsItem.image }} style={styles.detailImage} />

      <View style={{ padding: 16 }}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{newsItem.category}</Text>
          <Text style={styles.date}>{newsItem.date}</Text>
        </View>
        <Text style={styles.detailTitle}>{newsItem.title}</Text>
        <Text style={styles.detailText}>{newsItem.content}</Text>
      </View>
    </ScrollView>
  );
}

function FaqScreen() {
  return (
    <View style={styles.screenContainer}>
      <SectionList
        sections={FAQ_SECTIONS}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ padding: 14, paddingBottom: 24 }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.faqCard}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      />
    </View>
  );
}

function ProtectedDrawerApp() {
  const { userEmail, logout } = useAuth();
  const [activeScreen, setActiveScreen] = useState('news');
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectScreen = (screenName) => {
    setActiveScreen(screenName);
    setSelectedNewsId(null);
    setDrawerOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E4B94' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.menuBtn}>
          <Ionicons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeScreen === 'news' ? 'Новини університету' : 'Довідковий центр'}
        </Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
        {activeScreen === 'news' ? (
          selectedNewsId ? (
            <NewsDetailScreen id={selectedNewsId} onBack={() => setSelectedNewsId(null)} />
          ) : (
            <NewsListScreen onSelectNews={(id) => setSelectedNewsId(id)} />
          )
        ) : (
          <FaqScreen />
        )}
      </View>

      <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.drawerPanel}>
            <View style={styles.drawerHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#1E4B94" />
              </View>
              <Text style={styles.userName}>Куліш Марія Олександрівна</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>

            <View style={{ flex: 1, paddingTop: 10 }}>
              <TouchableOpacity
                style={[styles.drawerItem, activeScreen === 'news' && styles.drawerItemActive]}
                onPress={() => selectScreen('news')}
              >
                <Ionicons name="newspaper-outline" size={22} color={activeScreen === 'news' ? '#1E4B94' : '#374151'} />
                <Text style={[styles.drawerItemText, activeScreen === 'news' && styles.drawerItemTextActive]}>
                  Стрічка новин
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerItem, activeScreen === 'faq' && styles.drawerItemActive]}
                onPress={() => selectScreen('faq')}
              >
                <Ionicons name="help-circle-outline" size={22} color={activeScreen === 'faq' ? '#1E4B94' : '#374151'} />
                <Text style={[styles.drawerItemText, activeScreen === 'faq' && styles.drawerItemTextActive]}>
                  Довідковий центр (FAQ)
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={22} color="#DC2626" />
              <Text style={styles.logoutText}>Вийти</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setDrawerOpen(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <ProtectedDrawerApp /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  loginContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  loginCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, elevation: 4 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16,
  },
  loginTitle: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center' },
  loginSubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, marginBottom: 16,
  },
  button: { backgroundColor: '#1E4B94', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  header: { height: 56, backgroundColor: '#1E4B94', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  menuBtn: { marginRight: 14, padding: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  screenContainer: { flex: 1, backgroundColor: '#F3F4F6' },
  listContent: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 20 },
  counterText: { fontSize: 12, color: '#6B7280', marginBottom: 8, textAlign: 'right' },

  card: {
    height: 124, marginBottom: 12, backgroundColor: '#FFFFFF',
    borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 2,
  },
  thumbnail: { width: 115, height: '100%', backgroundColor: '#E5E7EB' },
  cardContent: { flex: 1, padding: 10, justifyContent: 'space-between' },
  category: { fontSize: 11, fontWeight: '700', color: '#1E4B94', textTransform: 'uppercase' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827', lineHeight: 19 },
  date: { fontSize: 12, color: '#6B7280' },

  detailContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 6,
    backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backText: { fontSize: 15, fontWeight: '600', color: '#1E4B94' },
  detailImage: { width: '100%', height: 220, backgroundColor: '#E5E7EB' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 14, lineHeight: 26 },
  detailText: { fontSize: 15, color: '#374151', lineHeight: 23 },

  sectionHeader: { backgroundColor: '#1E4B94', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, marginTop: 10, marginBottom: 8 },
  sectionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  faqCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 8, elevation: 1 },
  question: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6 },
  answer: { fontSize: 14, color: '#4B5563', lineHeight: 20 },

  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  drawerPanel: { width: 280, backgroundColor: '#FFFFFF', height: '100%' },
  drawerHeader: { backgroundColor: '#1E4B94', padding: 20, paddingTop: 32 },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  userName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  userEmail: { color: '#DBEAFE', fontSize: 12, marginTop: 2 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, gap: 12 },
  drawerItemActive: { backgroundColor: '#EFF6FF' },
  drawerItemText: { fontSize: 15, fontWeight: '500', color: '#374151' },
  drawerItemTextActive: { color: '#1E4B94', fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 10 },
  logoutText: { color: '#DC2626', fontSize: 16, fontWeight: '600' },
});