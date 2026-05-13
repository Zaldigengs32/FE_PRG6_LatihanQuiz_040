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
import PropTypes from 'prop-types';
import axios from 'axios';

const API_URL = 'http://10.1.9.195:8080/api/buildings/type/2';

export default function HouseScreen({ navigation }) {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setBuildings(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setBuildings([]);
      } else {
        Alert.alert('Error', 'Gagal mengambil data: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, fetchData]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('Detail', { building: item })}
      activeOpacity={0.7}
    >
      <Text style={styles.rowNumber}>{index + 1}</Text>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{item.buldingName}</Text>
        <Text style={styles.rowSub}>{item.location || '-'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => navigation.openDrawer()}
        >
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>In The House Apps</Text>
        <View style={styles.hamburger} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#333" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={buildings}
          keyExtractor={(item) => String(item.idBuilding)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada data rumah.</Text>
          }
        />
      )}

      <View style={styles.switchBar}>
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => navigation.navigate('Apart')}
        >
          <Text style={styles.switchText}>Apart</Text>
        </TouchableOpacity>
        <View style={[styles.switchBtn, styles.switchBtnActive]}>
          <Text style={styles.switchTextActive}>House</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

HouseScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    openDrawer: PropTypes.func.isRequired,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  hamburger: {
    width: 28,
    gap: 5,
    justifyContent: 'center',
  },
  bar: {
    height: 2,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  switchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  switchBtn: {
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5BA4CF',
  },
  switchBtnActive: {
    backgroundColor: '#5BA4CF',
    borderColor: '#5BA4CF',
  },
  switchText: {
    fontSize: 13,
    color: '#5BA4CF',
    fontWeight: '600',
  },
  switchTextActive: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowNumber: {
    width: 28,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  rowInfo: {
    flex: 1,
    marginLeft: 6,
  },
  rowName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  rowSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 15,
  },
});
