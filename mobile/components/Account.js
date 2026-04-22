import { StyleSheet, View, Text, Button, SafeAreaView } from 'react-native';
import { supabase } from '../lib/supabase';
import Ingredients from './Ingredients';

export default function Account({ session }) {
  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Hi,</Text>
          <Text style={styles.email}>{session.user.email}</Text>
        </View>
        <Button title="Sign out" onPress={signOut} />
      </View>

      <Ingredients session={session} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hello: {
    fontSize: 12,
    color: '#888',
  },
  email: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
