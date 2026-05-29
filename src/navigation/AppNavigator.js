import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { setUser, setRole, logout } from '../store/slices/authSlice';

import AuthNavigator   from './AuthNavigator';
import AdminNavigator  from './AdminNavigator';
import ExpertNavigator from './ExpertNavigator';
import UserNavigator   from './UserNavigator';
import SplashScreen    from '../screens/auth/SplashScreen';

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const doc = await firestore()
          .collection('users')
          .doc(firebaseUser.uid)
          .get();

        if (doc.exists) {
          const data = doc.data();
          dispatch(setUser({ uid: firebaseUser.uid, email: firebaseUser.email }));
          dispatch(setRole(data.role));
        }
        setCurrentUser(firebaseUser);
      } else {
        setCurrentUser(null);
        dispatch(logout());
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {!currentUser ? (
        <AuthNavigator />
      ) : role === 'admin' ? (
        <AdminNavigator />
      ) : role === 'expert' ? (
        <ExpertNavigator />
      ) : (
        <UserNavigator />
      )}
    </NavigationContainer>
  );
}