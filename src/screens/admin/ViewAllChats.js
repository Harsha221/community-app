import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ViewAllChats() {
  const [chats, setChats]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('updatedAt', 'desc')
      .onSnapshot((snap) => {
        setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.chatIcon}>💬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.userName || 'User'} → {item.expertName || 'Expert'}</Text>
              <Text style={styles.last} numberOfLines={1}>{item.lastMessage || 'No message yet'}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: item.isActive ? '#D1FAE5' : '#F3F4F6' }]}>
              <Text style={{ fontSize: 11, color: item.isActive ? '#065F46' : '#6B7280' }}>
                {item.isActive ? 'Active' : 'Closed'}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Koi chat nahi hai</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  title    : { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 20 },
  card     : { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  chatIcon : { fontSize: 24, marginRight: 12 },
  name     : { fontSize: 14, fontWeight: '600', color: '#111827' },
  last     : { fontSize: 12, color: '#6B7280', marginTop: 2 },
  badge    : { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  empty    : { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});