import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)}${units[i]}`;
}

export default function FileManagerScreen() {
  const router = useRouter();

  const [pathSegments, setPathSegments] = useState([]);
  const [items, setItems] = useState([]);
  const [storageStats, setStorageStats] = useState({
    total: 0,
    free: 0,
    used: 0,
  });

  const [createModalType, setCreateModalType] = useState(null); 
  const [itemName, setItemName] = useState('');
  const [fileContent, setFileContent] = useState('');

  const getCurrentDirectory = useCallback(() => {
    if (pathSegments.length === 0) {
      return new Directory(Paths.document);
    }
    return new Directory(Paths.document, ...pathSegments);
  }, [pathSegments]);

  const loadDirectoryAndStorage = useCallback(() => {
    try {
     
      const total = Paths.totalDiskSpace || 0;
      const free = Paths.availableDiskSpace || 0;
      const used = Math.max(total - free, 0);
      setStorageStats({ total, free, used });

      const currentDir = getCurrentDirectory();
      if (!currentDir.exists) {
        currentDir.create({ intermediates: true });
      }

      const rawContents = currentDir.list();
      const mapped = rawContents.map((entry) => {
        const isDir = entry instanceof Directory;
        return {
          name: entry.name,
          uri: entry.uri,
          isDirectory: isDir,
        };
      });

      mapped.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      setItems(mapped);
    } catch (error) {
      Alert.alert('Помилка файлової системи', error.message);
    }
  }, [getCurrentDirectory]);

  useFocusEffect(
    useCallback(() => {
      loadDirectoryAndStorage();
    }, [loadDirectoryAndStorage])
  );

  const handleOpenFolder = (folderName) => {
    setPathSegments((prev) => [...prev, folderName]);
  };

  const handleGoUp = () => {
    if (pathSegments.length > 0) {
      setPathSegments((prev) => prev.slice(0, -1));
    }
  };

  const handleOpenFile = (fileItem) => {
    if (fileItem.name.toLowerCase().endsWith('.txt')) {
      router.push({
        pathname: '/editor',
        params: { uri: fileItem.uri, name: fileItem.name },
      });
    } else {
      Alert.alert(
        'Формат файлу',
        'Редагування підтримується лише для текстових файлів (.txt). Ви можете переглянути властивості файлу.',
        [
          { text: 'Закрити', style: 'cancel' },
          {
            text: 'Інформація',
            onPress: () =>
              router.push({
                pathname: '/details',
                params: { uri: fileItem.uri, name: fileItem.name, isDir: 'false' },
              }),
          },
        ]
      );
    }
  };

  const handleCreate = () => {
    const trimmed = itemName.trim();
    if (!trimmed) {
      Alert.alert('Помилка', 'Введіть назву об’єкта');
      return;
    }

    try {
      const currentDir = getCurrentDirectory();

      if (createModalType === 'folder') {
        const newDir = new Directory(currentDir, trimmed);
        if (newDir.exists) {
          Alert.alert('Увага', 'Папка з такою назвою вже існує');
          return;
        }
        newDir.create();
      } else if (createModalType === 'file') {
        const finalName = trimmed.toLowerCase().endsWith('.txt') ? trimmed : `${trimmed}.txt`; const newFile = new File(currentDir, finalName); if (newFile.exists) { Alert.alert('Увага', 'Файл із таким іменем вже існує'); return; } newFile.create(); newFile.write(fileContent); }  setCreateModalType(null); setItemName(''); setFileContent(''); loadDirectoryAndStorage(); } catch (error) { Alert.alert('Помилка створення', error.message); } };  
        </Text>
      </View>

      {}
      <View style={styles.createBar}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => {
            setItemName('');
            setCreateModalType('folder');
          }}
        >
          <Ionicons name="folder-open-outline" size={18} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Нова папка</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: '#059669' }]}
          onPress={() => {
            setItemName('');
            setFileContent('');
            setCreateModalType('file');
          }}
        >
          <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Новий .txt файл</Text>
        </TouchableOpacity>
      </View>

      {}
      <FlatList
        data={items}
        keyExtractor={(item) => item.uri}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>Ця папка порожня</Text>
          </View>
        }
      />

      {}
      <Modal
        visible={!!createModalType}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {createModalType === 'folder' ? 'Створити нову папку' : 'Створити текстовий файл (.txt)'}
            </Text>

            <Text style={styles.inputLabel}>
              {createModalType === 'folder' ? 'Назва папки:' : 'Ім’я файлу:'}
            </Text>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder={createModalType === 'folder' ? 'Наприклад: Documents' : 'Наприклад: notes.txt'}
              autoFocus
            />

            {createModalType === 'file' && (
              <>
                <Text style={styles.inputLabel}>Початковий вміст файлу:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={fileContent}
                  onChangeText={setFileContent}
                  placeholder="Введіть текст..."
                  multiline
                />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#E5E7EB' }]}
                onPress={() => setCreateModalType(null)}
              >
                <Text style={{ color: '#374151', fontWeight: '700' }}>Скасувати</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#1E4B94' }]}
                onPress={handleCreate}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  storageCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },
  storageTitle: { fontSize: 13, fontWeight: '700', color: '#1E4B94', marginBottom: 8 },
  storageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  storageCol: { alignItems: 'center', flex: 1 },
  storageLabel: { fontSize: 11, color: '#6B7280' },
  storageValue: { fontSize: 14, fontWeight: '800', color: '#111827', marginTop: 2 },
  breadcrumbBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  upBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  upBtnDisabled: { backgroundColor: '#F3F4F6' },
  upText: { fontSize: 13, fontWeight: '700', color: '#1E4B94' },
  pathText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },
  createBar: { flexDirection: 'row', padding: 12, gap: 10 },
  createBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1E4B94',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  createBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  listContent: { paddingHorizontal: 12, paddingBottom: 24 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    elevation: 1,
  },
  itemMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  itemType: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  actionGroup: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 8 },
  iconActionBtn: { padding: 6 },
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#6B7280', fontSize: 15, marginTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
});