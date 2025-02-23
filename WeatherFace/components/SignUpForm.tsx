import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import * as yup from 'yup';
import 'yup-phone-lite';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ErrorText } from '@/components/ui/ErrorText';
import { SignUpFormData, City } from '@/types';
import { ThemedText } from '@/components/ThemedText';

//FIX think about different layout - now if user switch to sign up screen, there is flat list inside Scrollview (Paralax)
export default function SignUpForm({
  onSubmit,
}: {
  onSubmit: (data: SignUpFormData) => void;
}) {
  const { t } = useTranslation();
  const [editingCity, setEditingCity] = useState<null | City>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .required(t('emailRequired'))
          .email(t('invalidEmail')),
        password: yup
          .string()
          .required(t('passwordRequired'))
          .min(8, t('passwordMinLength')),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password'), undefined], t('passwordsMustMatch'))
          .required(t('enterPasswordAgain')),
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
    trigger,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      cities: [],
    },
  });

  const addCitiesAndSubmit = useCallback(
    (data: SignUpFormData) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  const handleCityPress = useCallback((cityId: string) => {
    //TODO add delete option
  }, []);

  //TODO check for unique post code - used as id
  const handleSaveCity = useCallback(
    (name: string, postCode: number) => {
      const newCity = {
        name: name,
        address: { postCode: postCode },
      };
      setCities([...cities, newCity]);
      setValue('cities', [...cities, newCity]);
      trigger();
      setModalVisible(false);
    },
    [cities, setCities, trigger, setValue, setModalVisible],
  );

  return (
    <View>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={t('email')}
              keyboardType="email-address"
            />
          )}
          name="email"
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </View>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={t('password')}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </View>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={t('confirmPassword')}
              secureTextEntry
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <ErrorText>{errors.confirmPassword.message}</ErrorText>
        )}
      </View>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={t('phoneNumber')}
              keyboardType="phone-pad"
            />
          )}
          name="phoneNumber"
        />
        {errors.phoneNumber && (
          <ErrorText>{errors.phoneNumber.message}</ErrorText>
        )}
      </View>
      <View>
        <FlatList
          data={cities}
          nestedScrollEnabled={true}
          keyExtractor={item => item.address.postCode.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCityPress(item.address.postCode.toString())}
            >
              <View style={styles.cityItem}>
                <ThemedText style={styles.cityName}>
                  {item.name} {item.address.postCode}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        />
        {errors.cities && <ErrorText>{errors.cities.message}</ErrorText>}
        <Button
          title={t('addNewCity')}
          testID="addcity-button"
          onPress={() => {
            setEditingCity(null);
            setModalVisible(true);
          }}
        />
      </View>
      <Modal visible={modalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <ThemedText
            style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
          >
            {t('addNewCity')}
          </ThemedText>
          <ThemedText type="subtitle">{t('cityName')}</ThemedText>
          <TextInput
            value={editingCity?.name}
            testID="cityname-input"
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
            testID="postcode-input"
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
      <Button title={t('signUp')} onPress={handleSubmit(addCitiesAndSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cityName: {
    fontSize: 18,
  },
});
