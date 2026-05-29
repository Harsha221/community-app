import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, Switch,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ManageExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('role', '==', 'expert')
      .onSnapshot((snap) => {
        setExperts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  const toggleActive = async (id, current) => {
    await firestore().collection('users').doc(id).update({ isActive: !current });
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Expert?', 'Yeh expert delete ho jayega', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => firestore().collection('users').doc(id).delete() },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Experts</Text>
      <FlatList
        data={experts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 22 }}>👨‍⚕️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.cat}>{item.category || 'No Category'}</Text>
            </View>
            <Switch
              value={item.isActive !== false}
              onValueChange={() => toggleActive(item.id, item.isActive !== false)}
              trackColor={{ true: '#2563EB' }}
            />
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 8 }}>
              <Text style={{ color: '#DC2626', fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Koi expert nahi hai</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  title    : { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 20 },
  card     : { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  avatar   : { width: 46, height: 46, borderRadius: 23, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  name     : { fontSize: 15, fontWeight: '600', color: '#111827' },
  email    : { fontSize: 12, color: '#6B7280' },
  cat      : { fontSize: 12, color: '#2563EB', marginTop: 2 },
  empty    : { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});