import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ManageUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('role', '==', 'user')
      .onSnapshot((snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  const handleBlock = async (id, blocked) => {
    await firestore().collection('users').doc(id).update({ isBlocked: !blocked });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity
              style={[styles.badge, { backgroundColor: item.isBlocked ? '#FEE2E2' : '#D1FAE5' }]}
              onPress={() => handleBlock(item.id, item.isBlocked)}
            >
              <Text style={{ color: item.isBlocked ? '#DC2626' : '#065F46', fontSize: 12, fontWeight: '600' }}>
                {item.isBlocked ? 'Blocked' : 'Active'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Koi user nahi hai</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  title    : { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 20 },
  card     : { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  avatar   : { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  name     : { fontSize: 15, fontWeight: '600', color: '#111827' },
  email    : { fontSize: 12, color: '#6B7280' },
  badge    : { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  empty    : { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});