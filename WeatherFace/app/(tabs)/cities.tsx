import React, { useState, useEffect } from 'react';
import { City } from '@/types';
import {
  StyleSheet,
  Platform,
  FlatList,
  View,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { WeatherView } from '@/components/WeatherView';
import { useAuth } from '@/hooks/useAuth';
import { useDataContext } from '@/context/DataContext';
import { getWeatherUrlForCity } from '@/constants/WeatherService';
import { useTranslation } from 'react-i18next';

export default function CitiesScreen() {
  const { state } = useAuth();
  const { t } = useTranslation();
  const { data, fetchData, loading, error } = useDataContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCityPress = async (city: City) => {
    setSelectedCity(city);
    await fetchData(getWeatherUrlForCity(city.name));
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (state.user?.cities && state.user.cities.length > 0) {
        setCities(state.user.cities);
    }
  }, [state]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t('selectCity')}</ThemedText>
      <ThemedView style={styles.cityContainer}>
        <FlatList
          data={cities}
          keyExtractor={item => item.address.postCode.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCityPress(item)}>
              <View style={styles.cityItem}>
                <ThemedText style={styles.cityName}>{item.name}</ThemedText>
              </View>
            </TouchableOpacity>
          )}
        />
      </ThemedView>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBG}>
          <View style={styles.modalContent}>
            {selectedCity && (
              <ThemedText style={styles.cityName}>
                {selectedCity.name} {selectedCity.address.postCode}
              </ThemedText>
            )}
            <WeatherView data={data} error={error} loading={loading} />
            <Button title={t('close')} onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 56 : 44, // Action bar height for Android and iOS
    padding: 20,
  },
  cityContainer: {
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  cityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cityName: {
    fontSize: 18,
  },
  modalBG: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
