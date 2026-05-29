import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

// Placeholder — baad mein replace karna
const ExpertDashboard = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Expert Dashboard</Text>
  </View>
);

const Stack = createStackNavigator();

export default function ExpertNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertDashboard" component={ExpertDashboard} />
    </Stack.Navigator>
  );
}