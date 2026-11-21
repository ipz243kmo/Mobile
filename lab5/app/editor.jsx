import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { File } from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FileEditorScreen() {
  const { uri, name } = useLocalSearchParams();
  const router = useRouter();
  const [content, setContent] = useState('');

  useEffect(() => {
    try {
      const file = new File(String(uri));
      if (file.exists) {
        const text = file.text();
        setContent(text);
      }
    } catch (error) {
      Alert.alert('Помилка читання', error.message);
    }
  }, [uri]);

  const handleSave = () => {
    try {
      const file = new File(String(uri));
      file.write(content);
      Alert.alert('Збережено', `Зміни у файлі "${name}" успішно збережено.`, [ { text: 'ОК', onPress: () => router.back() }, ]); } catch (error) { Alert.alert('Помилка збереження', error.message); } };  return ( <View style={styles.container}> <View style={styles.fileHeader}> <Ionicons name="document-text" size={22} color="#1E4B94" /> <Text style={styles.fileName}>{name}</Text> </View>  <TextInput style={styles.editorInput} value={content} onChangeText={setContent} multiline placeholder="Вміст текстового файлу..." />  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}> <Ionicons name="save-outline" size={20} color="#FFFFFF" /> <Text style={styles.saveBtnText}>Зберегти зміни</Text> </TouchableOpacity> </View> ); }  const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 }, fileHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, marginBottom: 12, gap: 8, }, fileName: { fontSize: 16, fontWeight: '700', color: '#111827' }, editorInput: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, fontSize: 15, color: '#111827', textAlignVertical: 'top', borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 14, }, saveBtn: { flexDirection: 'row', backgroundColor: '#1E4B94', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 8, }, saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }, }); ```  ---  #### 4) Екран детальної інформації про файл / папку — `app/details.jsx` Отримує метадані (`info()`) та виводить: назву файлу, тип файлу (за розширенням), розмір та дату останньої модифікації[cite: 17, 18].  ```jsx import React, { useState, useEffect } from 'react'; import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; import { File, Directory } from 'expo-file-system'; import { useLocalSearchParams, useRouter } from 'expo-router'; import { Ionicons } from '@expo/vector-icons';  function formatBytes(bytes) { if (!bytes \vert{}\vert{} bytes <= 0) return '0 Б'; const units = ['Б', 'КБ', 'МБ', 'ГБ']; const i = Math.floor(Math.log(bytes) / Math.log(1024)); return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`; }  export default function FileDetailsScreen() { const { uri, name, isDir } = useLocalSearchParams(); const router = useRouter(); const [meta, setMeta] = useState({ name: String(name), type: '', size: '0 Б', modificationTime: 'Невідомо', uri: String(uri), });  useEffect(() => { const isDirectory = isDir === 'true'; const strName = String(name);  
    }

    try {
      const target = isDirectory ? new Directory(String(uri)) : new File(String(uri));
      const info = target.info();
      const modDate = info.modificationTime
        ? new Date(info.modificationTime).toLocaleString('uk-UA')
        : 'Невідомо';

      setMeta({
        name: strName,
        type: fileType,
        size: isDirectory ? 'Папка' : formatBytes(info.size || target.size || 0),
        modificationTime: modDate,
        uri: String(uri),
      });
    } catch {
      setMeta((prev) => ({ ...prev, type: fileType }));
    }
  }, [uri, name, isDir]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={isDir === 'true' ? 'folder' : 'document-text'}
            size={40}
            color={isDir === 'true' ? '#D97706' : '#1E4B94'}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Назва об’єкта:</Text>
          <Text style={styles.value}>{meta.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Тип файлу (за розширенням):</Text>
          <Text style={styles.value}>{meta.type}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Розмір:</Text>
          <Text style={styles.value}>{meta.size}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Дата останньої модифікації:</Text>
          <Text style={styles.value}>{meta.modificationTime}</Text>
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Повний URI:</Text>
          <Text style={styles.uriText}>{meta.uri}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.closeBtnText}>Закрити</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, elevation: 2 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  value: { fontSize: 15, fontWeight: '700', color: '#111827' },
  uriText: { fontSize: 12, color: '#374151', marginTop: 2 },
  closeBtn: {
    backgroundColor: '#1E4B94',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  closeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});