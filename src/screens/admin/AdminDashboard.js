// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import { useDispatch } from 'react-redux';
// import { logout } from '../../store/slices/authSlice';

// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const [counts, setCounts] = useState({ users: 0, experts: 0, categories: 0, chats: 0 });

//   useEffect(() => {
//     const fetchCounts = async () => {
//       const [users, experts, categories, chats] = await Promise.all([
//         firestore().collection('users').where('role', '==', 'user').get(),
//         firestore().collection('users').where('role', '==', 'expert').get(),
//         firestore().collection('categories').get(),
//         firestore().collection('chats').get(),
//       ]);
//       setCounts({
//         users     : users.size,
//         experts   : experts.size,
//         categories: categories.size,
//         chats     : chats.size,
//       });
//     };
//     fetchCounts();
//   }, []);

//   const handleLogout = async () => {
//     await auth().signOut();
//     dispatch(logout());
//   };

//   const cards = [
//     { label: 'Total Users',      value: counts.users,      emoji: '👥', color: '#DBEAFE' },
//     { label: 'Total Experts',    value: counts.experts,    emoji: '👨‍⚕️', color: '#D1FAE5' },
//     { label: 'Categories',       value: counts.categories, emoji: '📂', color: '#FEF3C7' },
//     { label: 'Active Chats',     value: counts.chats,      emoji: '💬', color: '#FCE7F3' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Admin Dashboard</Text>
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.grid}>
//         {cards.map((card) => (
//           <View key={card.label} style={[styles.card, { backgroundColor: card.color }]}>
//             <Text style={styles.cardEmoji}>{card.emoji}</Text>
//             <Text style={styles.cardValue}>{card.value}</Text>
//             <Text style={styles.cardLabel}>{card.label}</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container : { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
//   header    : { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 },
//   title     : { fontSize: 22, fontWeight: '700', color: '#111827' },
//   logoutBtn : { backgroundColor: '#FEE2E2', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
//   logoutText: { color: '#DC2626', fontWeight: '600' },
//   grid      : { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//   card      : { width: '47%', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
//   cardEmoji : { fontSize: 32, marginBottom: 8 },
//   cardValue : { fontSize: 28, fontWeight: '700', color: '#111827' },
//   cardLabel : { fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'center' },
// });

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const [counts, setCounts]   = useState({ users: 0, experts: 0, categories: 0, chats: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const db = getFirestore();
      const [u, e, c, ch] = await Promise.all([
        getDocs(query(collection(db, 'users'),      where('role', '==', 'user'))),
        getDocs(query(collection(db, 'users'),      where('role', '==', 'expert'))),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'chats')),
      ]);
      setCounts({ users: u.size, experts: e.size, categories: c.size, chats: ch.size });
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const handleLogout = async () => {
    await signOut(getAuth());
    dispatch(logout());
  };

  const cards = [
    { label: 'Total Users',   value: counts.users,      icon: '👥', bg: '#EFF6FF', accent: '#2563EB' },
    { label: 'Experts',       value: counts.experts,    icon: '🩺', bg: '#F0FDF4', accent: '#16A34A' },
    { label: 'Categories',    value: counts.categories, icon: '📂', bg: '#FFFBEB', accent: '#D97706' },
    { label: 'Active Chats',  value: counts.chats,      icon: '💬', bg: '#FDF4FF', accent: '#9333EA' },
  ];

  const menuItems = [
    { label: 'Manage Categories', icon: '📂', screen: 'Categories', color: '#FEF3C7', border: '#F59E0B' },
    { label: 'Manage Experts',    icon: '🩺', screen: 'Experts',    color: '#D1FAE5', border: '#10B981' },
    { label: 'Manage Users',      icon: '👥', screen: 'Users',      color: '#DBEAFE', border: '#3B82F6' },
    { label: 'View All Chats',    icon: '💬', screen: 'Chats',      color: '#EDE9FE', border: '#8B5CF6' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day, Admin 👋</Text>
          <Text style={styles.subtitle}>Community Advisory Platform</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Overview</Text>
        {loading ? (
          <ActivityIndicator color="#2563EB" style={{ marginVertical: 24 }} />
        ) : (
          <View style={styles.grid}>
            {cards.map((card) => (
              <View key={card.label} style={[styles.statCard, { backgroundColor: card.bg }]}>
                <Text style={styles.statIcon}>{card.icon}</Text>
                <Text style={[styles.statValue, { color: card.accent }]}>{card.value}</Text>
                <Text style={styles.statLabel}>{card.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuCard, { backgroundColor: item.color, borderLeftColor: item.border }]}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container   : { flex: 1, backgroundColor: '#F8FAFC' },
  header      : {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  greeting    : { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  subtitle    : { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  logoutBtn   : { backgroundColor: '#FEE2E2', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  logoutText  : { color: '#DC2626', fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, marginLeft: 20, marginTop: 24, marginBottom: 12, textTransform: 'uppercase' },
  grid        : { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 10 },
  statCard    : { width: '47%', borderRadius: 16, padding: 18, alignItems: 'flex-start' },
  statIcon    : { fontSize: 28, marginBottom: 10 },
  statValue   : { fontSize: 30, fontWeight: '800' },
  statLabel   : { fontSize: 12, color: '#64748B', marginTop: 4 },
  menuGrid    : { paddingHorizontal: 20, gap: 10 },
  menuCard    : {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, padding: 16,
    borderLeftWidth: 4,
  },
  menuIcon    : { fontSize: 22, marginRight: 14 },
  menuLabel   : { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  menuArrow   : { fontSize: 18, color: '#94A3B8' },
});

