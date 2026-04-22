import { StyleSheet, View, Text, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Account({ session }) {
  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.email}>{session.user.email}</Text>
      <Text style={styles.hint}>You are logged in.</Text>

      <View style={styles.button}>
        <Button title="Sign out" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  hint: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
  },
});
