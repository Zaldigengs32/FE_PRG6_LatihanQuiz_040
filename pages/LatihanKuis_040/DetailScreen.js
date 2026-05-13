import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';

const API_URL = 'http://10.1.9.195:8080/api/buildings';

export default function DetailScreen({ route, navigation }) {
  const { building } = route.params;
  const isAdd = !building?.idBuilding;

  const [buldingName, setBuldingName] = useState(building?.buldingName || '');
  const [buildingType, setBuildingType] = useState(building?.buildingType || '');
  const [location, setLocation] = useState(building?.location || '');
  const [buildingArea, setBuildingArea] = useState(
    building?.buildingArea ? String(building.buildingArea) : ''
  );
  const [loading, setLoading] = useState(false);

  const calcPrice = (type, area) => {
    const a = parseInt(area, 10);
    if (!a || isNaN(a)) return '';
    if (type === '1') return String(a * 150000);
    if (type === '2') return String(a * 180000);
    return '';
  };

  const price = building?.price
    ? String(building.price)
    : calcPrice(buildingType, buildingArea);

  const handleCreate = async () => {
    if (!buldingName.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Building Name tidak boleh kosong.');
      } else {
        Alert.alert('Validasi', 'Building Name tidak boleh kosong.');
      }
      return;
    }
    if (buildingType !== '1' && buildingType !== '2') {
      if (Platform.OS === 'web') {
        window.alert('Building Type harus 1 (Apartment) atau 2 (House).');
      } else {
        Alert.alert('Validasi', 'Building Type harus 1 (Apartment) atau 2 (House).');
      }
      return;
    }
    try {
      setLoading(true);
      await axios.post(API_URL, {
        buldingName: buldingName.trim(),
        buildingType,
        location: location.trim(),
        buildingArea: buildingArea ? parseInt(buildingArea, 10) : null,
      });
      if (Platform.OS === 'web') {
        window.alert('Data berhasil ditambahkan.');
        navigation.goBack();
      } else {
        Alert.alert('Sukses', 'Data berhasil ditambahkan.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (Platform.OS === 'web') {
        window.alert('Gagal menambahkan data: ' + msg);
      } else {
        Alert.alert('Error', 'Gagal menambahkan data: ' + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = Platform.OS === 'web'
      ? window.confirm(`Yakin ingin menghapus "${buldingName}"?`)
      : await new Promise((resolve) => {
          Alert.alert(
            'Konfirmasi Hapus',
            `Yakin ingin menghapus "${buldingName}"?`,
            [
              { text: 'Batal', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Hapus', style: 'destructive', onPress: () => resolve(true) },
            ]
          );
        });

    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${building.idBuilding}`);
      if (Platform.OS === 'web') {
        window.alert('Data berhasil dihapus.');
        navigation.goBack();
      } else {
        Alert.alert('Sukses', 'Data berhasil dihapus.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (Platform.OS === 'web') {
        window.alert('Gagal menghapus data: ' + msg);
      } else {
        Alert.alert('Error', 'Gagal menghapus data: ' + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Building Name</Text>
      <TextInput
        style={styles.input}
        value={buldingName}
        onChangeText={setBuldingName}
      />

      <Text style={styles.label}>Building Type</Text>
      <TextInput
        style={styles.input}
        value={buildingType}
        onChangeText={(text) => {
          if (text === '' || text === '1' || text === '2') {
            setBuildingType(text);
          }
        }}
        keyboardType="number-pad"
        maxLength={1}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Building Area</Text>
      <TextInput
        style={styles.input}
        value={buildingArea}
        onChangeText={(text) => setBuildingArea(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={price}
        editable={false}
      />

      {loading && (
        <ActivityIndicator
          size="small"
          color="#333"
          style={{ marginVertical: 8 }}
        />
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.btnText}>+ Add Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteBtn, isAdd && styles.btnDisabled]}
          onPress={handleDelete}
          disabled={loading || isAdd}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

DetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      building: PropTypes.shape({
        idBuilding: PropTypes.number,
        buldingName: PropTypes.string,
        buildingType: PropTypes.string,
        location: PropTypes.string,
        buildingArea: PropTypes.number,
        price: PropTypes.number,
      }),
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputDisabled: {
    backgroundColor: '#ebebeb',
    color: '#aaa',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 12,
  },
  addBtn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5BA4CF',
    backgroundColor: '#5BA4CF',
  },
  deleteBtn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E74C3C',
    backgroundColor: '#E74C3C',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
