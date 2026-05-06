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
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.1.9.195:8080/api/phonebooks';

export default function DetailScreen({ route, navigation }) {
  const { contact, mode } = route.params;
  const isAdd = mode === 'add';

  const [firstName, setFirstName] = useState(contact?.firstName || '');
  const [lastName, setLastName] = useState(contact?.lastName || '');
  const [birthDate, setBirthDate] = useState(contact?.birthDate || '');
  const [phoneNumber, setPhoneNumber] = useState(contact?.phoneNumber || '');
  const [status, setStatus] = useState(contact?.status || '');
  const [address, setAddress] = useState(contact?.address || '');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validasi', 'First Name tidak boleh kosong.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(API_URL, {
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        status,
        address,
      });
      Alert.alert('Sukses', 'Data berhasil ditambahkan.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      Alert.alert('Error', 'Gagal menambahkan data: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validasi', 'First Name tidak boleh kosong.');
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${API_URL}/${contact.idContact}`, {
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        status,
        address,
      });
      Alert.alert('Sukses', 'Data berhasil diperbarui.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      Alert.alert('Error', 'Gagal memperbarui data: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus kontak "${firstName} ${lastName}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`${API_URL}/${contact.idContact}`);
              Alert.alert('Sukses', 'Data berhasil dihapus.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              const msg = err.response?.data?.message || err.message;
              Alert.alert('Error', 'Gagal menghapus data: ' + msg);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Birth Date</Text>
      <TextInput
        style={styles.input}
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder="yyyy-mm-dd"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={(text) => {
          const digitsOnly = text.replace(/[^0-9]/g, '');
          setPhoneNumber(digitsOnly);
        }}
        placeholder="Only Number"
        placeholderTextColor="#bbb"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={(text) => {
          if (text === '' || text === '1' || text === '2') {
            setStatus(text);
          }
        }}
        keyboardType="number-pad"
        maxLength={1}
        placeholder="1 = Married, 2 = Single"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      {loading && <ActivityIndicator size="small" color="#0056A0" style={{ marginVertical: 8 }} />}

      {isAdd ? (
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={loading}>
          <Text style={styles.addBtnText}>+ Add Data</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} disabled={loading}>
            <Text style={styles.actionBtnText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={loading}>
            <Text style={styles.actionBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addBtn: {
    marginTop: 28,
    backgroundColor: '#87CEEB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 12,
  },
  updateBtn: {
    flex: 1,
    backgroundColor: '#F5A623',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
