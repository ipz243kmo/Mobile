import React, { useCallback } from 'react';
import { View, Text, VirtualizedList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';

const LOG_ITEM_HEIGHT = 82;

export default function SystemLogsScreen() {
  const { logs } = useAdmin();

  const getItem = (data, index) => data[index];
  const getItemCount = (data) => data.length;
  const getItemLayout = (_, index) => ({
    length: LOG_ITEM_HEIGHT,
    offset: LOG_ITEM_HEIGHT * index,
    index,
  });

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.logCard}>
        <Ionicons name="document-text-outline" size={22} color="#1E4B94" />
        <View style={styles.logBody}>
          <View style={styles.row}>
            <Text style={styles.action}>{item.action}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
          <Text style={styles.details} numberOfLines={1}>{item.details}</Text>
        </View>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <VirtualizedList
        data={logs}
        initialNumToRender={15}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  list: { padding: 12 },
  logCard: {
    height: 70, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 10,
    paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, elevation: 1,
  },
  logBody: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  action: { fontSize: 13, fontWeight: '700', color: '#1E4B94' },
  time: { fontSize: 11, color: '#6B7280' },
  details: { fontSize: 12, color: '#374151' },
});