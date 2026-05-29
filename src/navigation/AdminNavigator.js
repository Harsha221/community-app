import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import AdminDashboard    from '../screens/admin/AdminDashboard';
import ManageCategories  from '../screens/admin/ManageCategories';
import ManageExperts     from '../screens/admin/ManageExperts';
import ManageUsers       from '../screens/admin/ManageUsers';
import ViewAllChats      from '../screens/admin/ViewAllChats';

const Tab = createBottomTabNavigator();

const icon = (label) => ({ focused }) => (
  <Text style={{ fontSize: 20 }}>
    {label === 'Dashboard'   ? '🏠' :
     label === 'Categories'  ? '📂' :
     label === 'Experts'     ? '👨‍⚕️' :
     label === 'Users'       ? '👥' : '💬'}
  </Text>
);

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor  : '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle            : { backgroundColor: '#FFFFFF', height: 60 },
        headerShown            : false,
      }}
    >
      <Tab.Screen name="Dashboard"  component={AdminDashboard}   options={{ tabBarIcon: icon('Dashboard')  }} />
      <Tab.Screen name="Categories" component={ManageCategories} options={{ tabBarIcon: icon('Categories') }} />
      <Tab.Screen name="Experts"    component={ManageExperts}    options={{ tabBarIcon: icon('Experts')    }} />
      <Tab.Screen name="Users"      component={ManageUsers}      options={{ tabBarIcon: icon('Users')      }} />
      <Tab.Screen name="Chats"      component={ViewAllChats}     options={{ tabBarIcon: icon('Chats')      }} />
    </Tab.Navigator>
  );
}