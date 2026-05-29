import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const [counts, setCounts] = useState({ users: 0, experts: 0, categories: 0, chats: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [users, experts, categories, chats] = await Promise.all([
        firestore().collection('users').where('role', '==', 'user').get(),
        firestore().collection('users').where('role', '==', 'expert').get(),
        firestore().collection('categories').get(),
        firestore().collection('chats').get(),
      ]);
      setCounts({
        users     : users.size,
        experts   : experts.size,
        categories: categories.size,
        chats     : chats.size,
      });
    };
    fetchCounts();
  }, []);

  const handleLogout = async () => {
    await auth().signOut();
    dispatch(logout());
  };

  const cards = [
    { label: 'Total Users',      value: counts.users,      emoji: '👥', color: '#DBEAFE' },
    { label: 'Total Experts',    value: counts.experts,    emoji: '👨‍⚕️', color: '#D1FAE5' },
    { label: 'Categories',       value: counts.categories, emoji: '📂', color: '#FEF3C7' },
    { label: 'Active Chats',     value: counts.chats,      emoji: '💬', color: '#FCE7F3' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.label} style={[styles.card, { backgroundColor: card.color }]}>
            <Text style={styles.cardEmoji}>{card.emoji}</Text>
            <Text style={styles.cardValue}>{card.value}</Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container : { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header    : { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  title     : { fontSize: 22, fontWeight: '700', color: '#111827' },
  logoutBtn : { backgroundColor: '#FEE2E2', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#DC2626', fontWeight: '600' },
  grid      : { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card      : { width: '47%', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
  cardEmoji : { fontSize: 32, marginBottom: 8 },
  cardValue : { fontSize: 28, fontWeight: '700', color: '#111827' },
  cardLabel : { fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'center' },
});