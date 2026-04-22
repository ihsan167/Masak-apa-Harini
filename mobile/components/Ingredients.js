import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function Ingredients({ session }) {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);

  // Load ingredients from database when component first shows
  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    setLoading(true);
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error loading ingredients', error.message);
    } else {
      setIngredients(data);
    }
    setLoading(false);
  }

  async function addIngredient() {
    if (!name.trim()) {
      Alert.alert('Please enter an ingredient name');
      return;
    }

    const { error } = await supabase.from('ingredients').insert({
      user_id: session.user.id,
      name: name.trim(),
      quantity: quantity ? parseFloat(quantity) : null,
      unit: unit.trim() || null,
    });

    if (error) {
      Alert.alert('Error adding ingredient', error.message);
    } else {
      // Clear the form
      setName('');
      setQuantity('');
      setUnit('');
      // Refresh the list
      fetchIngredients();
    }
  }

  async function deleteIngredient(id) {
    const { error } = await supabase.from('ingredients').delete().eq('id', id);

    if (error) {
      Alert.alert('Error deleting ingredient', error.message);
    } else {
      fetchIngredients();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Ingredients</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Ingredient name (e.g., Rice)"
          value={name}
          onChangeText={setName}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.quantityInput]}
            placeholder="Qty"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.unitInput]}
            placeholder="Unit (kg, pcs, L)"
            value={unit}
            onChangeText={setUnit}
            autoCapitalize="none"
          />
        </View>
        <Button title="Add Ingredient" onPress={addIngredient} />
      </View>

      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchIngredients}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No ingredients yet. Add some above!
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ingredientName}>{item.name}</Text>
              {(item.quantity || item.unit) && (
                <Text style={styles.ingredientDetail}>
                  {item.quantity ?? ''} {item.unit ?? ''}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => deleteIngredient(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  form: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  quantityInput: {
    flex: 1,
  },
  unitInput: {
    flex: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ingredientDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    color: '#d33',
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 14,
  },
});
