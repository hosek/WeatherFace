import { useCallback, useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Button,
  Modal,
  View,
  Alert,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import 'yup-phone-lite';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { City, User } from '@/types';
import { ThemedText } from '@/components/ThemedText';
import { ErrorText } from '@/components/ui/ErrorText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { state, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<null | City>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCity, setEditingCity] = useState<null | City>(null);

  //TODO Add password change logic - old password, new password, verification
  const schema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .required(t('emailRequired'))
          .email(t('invalidEmail')),
        phoneNumber: yup
          .string()
          .phone('CZ', t('validPhone')) //FIXME change validation state rule regarding device locale
          .required(t('phoneRequired')),
        cities: yup
          .array()
          .min(1, t('minCity'))
          .required(t('minCity'))
          .of(
            yup.object().shape({
              name: yup.string().required(),
              address: yup.object().shape({
                postCode: yup.number().required(),
              }),
            }),
          ),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      cities: [],
    },
  });

  useEffect(() => {
    if (state.user) {
      setCities(state.user.cities);
      setValue('email', state.user.email);
      setValue('phoneNumber', state.user.phoneNumber);
      if (state.user.cities.length > 0) {
        setSelectedCity(state.user.cities[0]);
      }
    }
  }, [state, setValue, setCities, setSelectedCity]);

  const onSubmit = useCallback(
    (data: User) => {
      updateProfile(data);
    },
    [updateProfile],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/auth'); // Redirect to sign-in page
  }, [signOut, router]);

  const handleSaveCity = useCallback(
    (name: string, postCode: number) => {
      if (editingCity) {
        setCities(prevCities =>
          prevCities.map(city =>
            city.address.postCode === editingCity.address.postCode
              ? { ...city, name, address: { postCode: Number(postCode) } }
              : city,
          ),
        );
        if (selectedCity.address.postCode === editingCity.address.postCode) {
          setSelectedCity({ ...selectedCity, name, address: { postCode } });
        }
      } else {
        const newCity = { name, address: { postCode: Number(postCode) } };
        setCities([...cities, newCity]);
        setSelectedCity(newCity);
      }
      setModalVisible(false);
      setEditingCity(null);
    },
    [
      cities,
      editingCity,
      selectedCity,
      setSelectedCity,
      setModalVisible,
      setEditingCity,
      setCities,
    ],
  );

  // FIXME Add delete confirmation
  const handleDeleteCity = useCallback(
    (postCode: number) => {
      if (cities.length === 1) {
        Alert.alert(t('lastCity'));
        return;
      }
      const filteredCities = cities.filter(
        city => city.address.postCode !== postCode,
      );
      setCities(filteredCities);
      if (selectedCity.address.postCode === postCode) {
        setSelectedCity(filteredCities[0] || null);
      }
    },
    [cities, selectedCity, t, setCities, setSelectedCity],
  );

  //TODO Extract profile edit fields to separate component
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          {state.user?.email} {t('nameProfile')}
        </ThemedText>
      </ThemedView>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View>
            <ThemedText type="subtitle">{t('email')}</ThemedText>
            <TextInput
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, value } }) => (
          <View>
            <ThemedText type="subtitle">{t('phoneNumber')}</ThemedText>
            <TextInput
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && (
              <ErrorText>{errors.phoneNumber.message}</ErrorText>
            )}
          </View>
        )}
      />

      {/* City Picker */}
      <View style={{ marginTop: 10 }}>
        <ThemedText type="subtitle" style={{ marginBottom: 5 }}>
          {t('selectCity')}:
        </ThemedText>
        <Picker
          selectedValue={selectedCity?.name}
          onValueChange={itemValue => {
            setSelectedCity(cities.find(city => city.name === itemValue)!);
          }}
        >
          {cities.map(city => (
            <Picker.Item
              key={city.address.postCode}
              label={city.name}
              value={city.name}
            />
          ))}
        </Picker>
      </View>

      {selectedCity && (
        <View
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: '#f1f1f1',
            borderRadius: 5,
          }}
        >
          <Text style={{ fontSize: 16 }}>{t('cityDetails')}:</Text>
          <Text>
            {t('cityName')}: {selectedCity.name}
          </Text>
          <Text>
            {t('postalCode')}: {selectedCity.address.postCode}
          </Text>
          <Button
            title={t('editCity')}
            onPress={() => {
              setEditingCity(selectedCity);
              setModalVisible(true);
            }}
          />
          <Button
            title={t('deleteCity')}
            onPress={() => handleDeleteCity(selectedCity.address.postCode)}
            color="red"
          />
        </View>
      )}
      <Button
        title={t('addNewCity')}
        onPress={() => {
          setEditingCity(null);
          setModalVisible(true);
        }}
      />
      <Button title={t('saveChanges')} onPress={handleSubmit(onSubmit)} />
      <Button title={t('logout')} onPress={handleSignOut} />
      {/* City Modal */}
      <Modal visible={modalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <ThemedText
            style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
          >
            {editingCity ? 'Edit City' : 'Add City'}
          </ThemedText>
          <ThemedText type="subtitle">{t('cityName')}</ThemedText>
          <TextInput
            value={editingCity?.name || ''}
            onChangeText={text =>
              setEditingCity(prev => ({
                ...(prev || { address: { postCode: 0 } }),
                name: text,
              }))
            }
          />
          <ThemedText type="subtitle">{t('postalCode')}</ThemedText>
          <TextInput
            value={editingCity?.address.postCode?.toString() || ''}
            onChangeText={text =>
              setEditingCity(prev => ({
                ...(prev || { name: '', address: { postCode: 0 } }),
                address: { postCode: Number(text) },
              }))
            }
            keyboardType="numeric"
          />
          <Button
            title="Save"
            onPress={() =>
              handleSaveCity(
                editingCity?.name || '',
                editingCity?.address?.postCode || 0,
              )
            }
          />
          <Button
            title="Cancel"
            onPress={() => setModalVisible(false)}
            color="gray"
          />
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 56 : 44,
    padding: 20,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
