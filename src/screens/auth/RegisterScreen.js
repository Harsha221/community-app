import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function RegisterScreen({ navigation }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Saare fields bharo');
      return;
    }
    setLoading(true);
    try {
      const res = await auth().createUserWithEmailAndPassword(email, password);
      await firestore().collection('users').doc(res.user.uid).set({
        name,
        email,
        role     : 'user',  // default role
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Account ban gaya!');
    } catch (error) {
      Alert.alert('Register Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Create Account 🎉</Text>
        <Text style={styles.subtitle}>Aaj hi join karo</Text>

        <TextInput style={styles.input} placeholder="Full Name"       placeholderTextColor="#9CA3AF" value={name}     onChangeText={setName}     />
        <TextInput style={styles.input} placeholder="Email Address"   placeholderTextColor="#9CA3AF" value={email}    onChangeText={setEmail}    keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password"        placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Register</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Pehle se account hai? Login karo</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container : { flex: 1, backgroundColor: '#F9FAFB', padding: 24 },
  title     : { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 6 },
  subtitle  : { fontSize: 14, color: '#6B7280', marginBottom: 32 },
  input     : {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, padding: 14, fontSize: 15, color: '#111827', marginBottom: 14,
  },
  button    : { backgroundColor: '#2563EB', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  link      : { textAlign: 'center', marginTop: 20, color: '#2563EB', fontSize: 14 },
});