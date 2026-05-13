import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_URL = 'http://10.1.9.195:8080/api/phonebooks';

export default function ListScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setContacts(res.data.data || []);
    } catch (err) {
      Alert.alert('Error', 'Gagal mengambil data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchContacts);
    return unsubscribe;
  }, [navigation, fetchContacts]);

  const getStatusBadge = (status) => {
    if (status === '1') return { label: 'M', bg: '#F5A623' };
    if (status === '2') return { label: 'S', bg: '#27AE60' };
    return { label: '?', bg: '#999' };
  };

  const renderItem = ({ item, index }) => {
    const badge = getStatusBadge(item.status);
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('Detail', { contact: item, mode: 'edit' })}
        activeOpacity={0.7}
      >
        <Text style={styles.rowNumber}>{index + 1}</Text>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.rowPhone}>{item.phoneNumber}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={styles.badgeText}>{badge.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phonebooks Apps</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => navigation.navigate('Detail', { contact: null, mode: 'add' })}
        >
          <Text style={styles.newBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator size="large" color="#0056A0" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => String(item.idContact)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada data kontak.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

ListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  newBtn: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  rowNumber: {
    width: 24,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  rowInfo: {
    flex: 1,
    marginLeft: 8,
  },
  rowName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  rowPhone: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 15,
  },
});
