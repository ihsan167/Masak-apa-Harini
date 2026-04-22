import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Account from './components/Account';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check if user is already logged in when app starts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for login/logout events and update the UI
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {session && session.user ? <Account session={session} /> : <Auth />}
      <StatusBar style="auto" />
    </View>
  );
}
