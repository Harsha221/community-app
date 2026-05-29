import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, Modal, ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalVisible, setModal]    = useState(false);
  const [catName, setCatName]       = useState('');
  const [catIcon, setCatIcon]       = useState('');
  const [editId, setEditId]         = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categories')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snap) => {
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  const openAdd  = () => { setEditId(null); setCatName(''); setCatIcon(''); setModal(true); };
  const openEdit = (item) => { setEditId(item.id); setCatName(item.name); setCatIcon(item.icon); setModal(true); };

  const handleSave = async () => {
    if (!catName.trim()) { Alert.alert('Error', 'Category naam daalo'); return; }
    const data = { name: catName.trim(), icon: catIcon.trim() || '📁' };
    if (editId) {
      await firestore().collection('categories').doc(editId).update(data);
    } else {
      await firestore().collection('categories').add({ ...data, createdAt: firestore.FieldValue.serverTimestamp() });
    }
    setModal(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete?', 'Kya aap sure hain?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => firestore().collection('categories').doc(id).delete() },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity onPress={() => openEdit(item)} style={styles.editBtn}>
              <Text style={{ color: '#2563EB' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.delBtn}>
              <Text style={{ color: '#DC2626' }}>Del</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Koi category nahi hai</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{editId ? 'Edit Category' : 'New Category'}</Text>
            <TextInput style={styles.input} placeholder="Category Name" placeholderTextColor="#9CA3AF" value={catName} onChangeText={setCatName} />
            <TextInput style={styles.input} placeholder="Icon Emoji (e.g. 🏥)" placeholderTextColor="#9CA3AF" value={catIcon} onChangeText={setCatIcon} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#E5E7EB' }]} onPress={() => setModal(false)}>
                <Text style={{ color: '#374151' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#2563EB' }]} onPress={handleSave}>
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container   : { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  header      : { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title       : { fontSize: 20, fontWeight: '700', color: '#111827' },
  addBtn      : { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText  : { color: '#fff', fontWeight: '600' },
  row         : { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 },
  icon        : { fontSize: 24, marginRight: 12 },
  name        : { flex: 1, fontSize: 15, color: '#111827' },
  editBtn     : { padding: 8, marginRight: 4 },
  delBtn      : { padding: 8 },
  empty       : { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalBox    : { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle  : { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  input       : { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12, fontSize: 15, color: '#111827', marginBottom: 12 },
  modalBtn    : { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
});