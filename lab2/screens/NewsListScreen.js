import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { ALL_NEWS } from '../data/mockData';
import NewsCard, { ITEM_HEIGHT } from '../components/NewsCard';

const PAGE_SIZE = 20;

export default function NewsListScreen({ navigation }) {
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const visibleData = ALL_NEWS.slice(0, displayedCount);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setDisplayedCount(PAGE_SIZE);
      setRefreshing(false);
    }, 800);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || displayedCount >= ALL_NEWS.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + PAGE_SIZE, ALL_NEWS.length));
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, displayedCount]);

  const handleOpenNews = useCallback(
    (id) => {
      navigation.navigate('NewsDetail', { id });
    },
    [navigation]
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item }) => <NewsCard item={item} onPress={handleOpenNews} />,
    [handleOpenNews]
  );

  return (
    <View style={styles.container}>
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
          loadingMore ? <ActivityIndicator size="small" color="#1E4B94" style={styles.loader} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  listContent: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 20 },
  counterText: { fontSize: 12, color: '#6B7280', marginBottom: 8, textAlign: 'right' },
  loader: { marginVertical: 14 },
});