import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🏥</Text>
      <Text style={styles.title}>Community Advisory</Text>
      <Text style={styles.subtitle}>Expert Help at Your Fingertips</Text>
      <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#EFF6FF',
    justifyContent : 'center',
    alignItems     : 'center',
  },
  logo: {
    fontSize   : 70,
    marginBottom: 16,
  },
  title: {
    fontSize  : 28,
    fontWeight: '700',
    color     : '#1E3A8A',
  },
  subtitle: {
    fontSize  : 14,
    color     : '#6B7280',
    marginTop : 8,
  },
});