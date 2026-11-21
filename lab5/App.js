import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  Modal, Alert, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_FS = [
  { id: '1', parentPath: '/', name: 'Лабораторні_роботи', isDirectory: true, size: 0, modifiedAt: '21.11.2026, 14:10' },
  { id: '2', parentPath: '/', name: 'Конспекти', isDirectory: true, size: 0, modifiedAt: '21.11.2026, 14:12' },
  { id: '3', parentPath: '/', name: 'README.txt', isDirectory: false, content: 'Файловий менеджер на базі expo-file-system.\nВиконала: Куліш М.О., ІПЗ-24-3.', size: 96, modifiedAt: '21.11.2026, 14:15' },
  { id: '4', parentPath: '/Лабораторні_роботи', name: 'Звіт_ЛР5.txt', isDirectory: false, content: 'Звіт з лабораторної роботи №5. Робота з локальною файловою системою.', size: 124, modifiedAt: '21.11.2026, 15:00' },
];

export default function App() {
  const [entries, setEntries] = useState(INITIAL_FS);
  const [currentPath, setCurrentPath] = useState('/');

  const [createType, setCreateType] = useState(null); 
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');

  const [editingFile, setEditingFile] = useState(null);
  const [editorText, setEditorText] = useState('');
  const [detailsItem, setDetailsItem] = useState(null);

  const totalBytes = 128 * 1024 * 1024 * 1024; 
  const usedBytes = 54.6 * 1024 * 1024 * 1024; 
  const freeBytes = totalBytes - usedBytes;

  const currentItems = entries
    .filter((e) => e.parentPath === currentPath)
    .sort((a, b) => (a.isDirectory === b.isDirectory ? a.name.localeCompare(b.name) : a.isDirectory ? -1 : 1));

  const goUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length === 0 ? '/' : `/${parts.join('/')}`); };  const openFolder = (name) => { setCurrentPath(currentPath === '/' ? `/${name}` : `${currentPath}/${name}`);
  };

  const handleCreate = () => {
    const clean = newName.trim();
    if (!clean) return;
    const now = new Date().toLocaleString('uk-UA');
    if (createType === 'folder') {
      setEntries((prev) => [...prev, { id: String(Date.now()), parentPath: currentPath, name: clean, isDirectory: true, size: 0, modifiedAt: now }]);
    } else {
      const fileName = clean.endsWith('.txt') ? clean : `${clean}.txt`; setEntries((prev) => [ ...prev, { id: String(Date.now()), parentPath: currentPath, name: fileName, isDirectory: false, content: newContent, size: newContent.length * 2, modifiedAt: now }, ]); } setCreateType(null); setNewName(''); setNewContent(''); };  const handleDelete = (item) => { Alert.alert('Підтвердження видалення', `Видалити "${item.name}"?`, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => setEntries((prev) => prev.filter((e) => e.id !== item.id)),
      },
    ]);
  };

  const saveEdit = () => {
    const now = new Date().toLocaleString('uk-UA');
    setEntries((prev) =>
      prev.map((e) => (e.id === editingFile.id ? { ...e, content: editorText, size: editorText.length * 2, modifiedAt: now } : e))
    );
    setEditingFile(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E4B94' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Файловий менеджер • ЛР №5</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
        {}
        <View style={styles.storageCard}>
          <Text style={{ fontWeight: '700', color: '#1E4B94', marginBottom: 6 }}>Статистика пам’яті пристрою</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View><Text style={styles.sLabel}>Загальний</Text><Text style={styles.sVal}>128.00 ГБ</Text></View>
            <View><Text style={styles.sLabel}>Зайнято</Text><Text style={[styles.sVal, { color: '#D97706' }]}>54.60 ГБ</Text></View>
            <View><Text style={styles.sLabel}>Вільно</Text><Text style={[styles.sVal, { color: '#059669' }]}>73.40 ГБ</Text></View>
          </View>
        </View>

        {}
        <View style={styles.pathBar}>
          <TouchableOpacity style={styles.upBtn} onPress={goUp} disabled={currentPath === '/'}>
            <Ionicons name="arrow-up" size={16} color={currentPath === '/' ? '#9CA3AF' : '#1E4B94'} />
            <Text style={{ fontWeight: '700', color: currentPath === '/' ? '#9CA3AF' : '#1E4B94' }}>Вгору</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontWeight: '600' }} numberOfLines={1}>/documents{currentPath === '/' ? '' : currentPath}</Text>
        </View>

        {}
        <View style={{ flexDirection: 'row', padding: 12, gap: 10 }}>
          <TouchableOpacity style={styles.btn} onPress={() => setCreateType('folder')}>
            <Ionicons name="folder-open-outline" size={18} color="#FFF" />
            <Text style={styles.btnText}>Нова папка</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#059669' }]} onPress={() => setCreateType('file')}>
            <Ionicons name="document-text-outline" size={18} color="#FFF" />
            <Text style={styles.btnText}>Новий .txt</Text>
          </TouchableOpacity>
        </View>

        {}
        <FlatList
          data={currentItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                onPress={() => {
                  if (item.isDirectory) openFolder(item.name);
                  else { setEditingFile(item); setEditorText(item.content || ''); }
                }}
              >
                <Ionicons name={item.isDirectory ? 'folder' : 'document-text'} size={26} color={item.isDirectory ? '#D97706' : '#1E4B94'} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>{item.isDirectory ? 'Папка' : `${item.size} Б`}</Text> </View> </TouchableOpacity> <TouchableOpacity onPress={() => setDetailsItem(item)} style={{ padding: 6 }}> <Ionicons name="information-circle-outline" size={22} color="#1E4B94" /> </TouchableOpacity> <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 6 }}> <Ionicons name="trash-outline" size={22} color="#DC2626" /> </TouchableOpacity> </View> )} /> </View>  {/* Modal створення */} <Modal visible={!!createType} transparent animationType="fade"> <View style={styles.overlay}> <View style={styles.modalBox}> <Text style={{ fontSize: 17, fontWeight: '700', marginBottom: 12 }}> {createType === 'folder' ? 'Створити папку' : 'Створити .txt файл'} </Text> <TextInput style={styles.input} placeholder="Введіть назву..." value={newName} onChangeText={setNewName} /> {createType === 'file' && ( <TextInput style={[styles.input, { height: 80 }]} placeholder="Початковий текст..." value={newContent} onChangeText={setNewContent} multiline /> )} <View style={{ flexDirection: 'row', gap: 10 }}> <TouchableOpacity style={[styles.btn, { backgroundColor: '#9CA3AF' }]} onPress={() => setCreateType(null)}><Text style={styles.btnText}>Скасувати</Text></TouchableOpacity> <TouchableOpacity style={styles.btn} onPress={handleCreate}><Text style={styles.btnText}>Створити</Text></TouchableOpacity> </View> </View> </View> </Modal>  {/* Modal редагування .txt */} <Modal visible={!!editingFile} animationType="slide"> <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#FFF' }}> <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Редагування: {editingFile?.name}</Text> <TextInput style={[styles.input, { flex: 1, textAlignVertical: 'top' }]} value={editorText} onChangeText={setEditorText} multiline /> <View style={{ flexDirection: 'row', gap: 10 }}> <TouchableOpacity style={[styles.btn, { backgroundColor: '#9CA3AF' }]} onPress={() => setEditingFile(null)}><Text style={styles.btnText}>Закрити</Text></TouchableOpacity> <TouchableOpacity style={styles.btn} onPress={saveEdit}><Text style={styles.btnText}>Зберегти</Text></TouchableOpacity> </View> </SafeAreaView> </Modal>  {/* Modal інформації про файл */} <Modal visible={!!detailsItem} transparent animationType="fade"> <View style={styles.overlay}> <View style={styles.modalBox}> <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E4B94', marginBottom: 12 }}>Атрибути об’єкта</Text> <Text style={styles.metaLine}>Назва: {detailsItem?.name}</Text> <Text style={styles.metaLine}>Тип: {detailsItem?.isDirectory ? 'Директорія' : 'Текстовий файл (.txt)'}</Text> <Text style={styles.metaLine}>Розмір: {detailsItem?.isDirectory ? 'Папка' : `${detailsItem?.size} Б`}</Text>
            <Text style={styles.metaLine}>Остання модифікація: {detailsItem?.modifiedAt}</Text>
            <TouchableOpacity style={[styles.btn, { marginTop: 14 }]} onPress={() => setDetailsItem(null)}><Text style={styles.btnText}>Закрити</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { height: 54, backgroundColor: '#1E4B94', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  storageCard: { backgroundColor: '#FFF', margin: 12, padding: 14, borderRadius: 12, elevation: 2 },
  sLabel: { fontSize: 11, color: '#6B7280' },
  sVal: { fontSize: 14, fontWeight: '800', color: '#111827' },
  pathBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 10, gap: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  upBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  btn: { flex: 1, flexDirection: 'row', backgroundColor: '#1E4B94', padding: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 6 },
  btnText: { color: '#FFF', fontWeight: '700' },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 8, elevation: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', borderRadius: 14, padding: 20 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, marginBottom: 12 },
  metaLine: { fontSize: 14, marginBottom: 6, color: '#374151' },
});