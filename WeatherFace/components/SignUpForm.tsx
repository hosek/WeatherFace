import React, { useState } from 'react';
import * as yup from 'yup';
import 'yup-phone-lite';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignUpFormData, City } from '@/types';
import { ThemedText } from '@/components/ThemedText';
import {
  View,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ErrorText } from '@/components/ui/ErrorText';

export default function SignUpForm(props: {
  onSubmit: (data: SignUpFormData) => void;
}) {
  const { t } = useTranslation();
  const [newCityName, setNewCityName] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [cities, setCities] = useState<City[]>([]);

  const schema = yup.object().shape({
    email: yup.string().required(t('emailRequired')).email(t('invalidEmail')),
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
      .phone('CZ', t('validPhone'))
      .required(t('phoneRequired')),
    cities: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        address: yup.object().shape({
          postCode: yup.number().required(),
        }),
      }),
    ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'john@example.com',
      password: '12345678',
      confirmPassword: '12345678',
      phoneNumber: '+420777123456',
      cities: [],
    },
  });

  const { onSubmit } = props;

  //FIXME Find better way to add cities data
  const addCitiesAndSubmit = (data: SignUpFormData) => {
    const finalData = { ...data, cities: cities };
    onSubmit(finalData);
  };

  const handleCityPress = (cityId: string) => {
    //TODO add delete option
  };

  const handleNewPostalCode = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setNewPostalCode(numericValue);
  };

  const addCity = () => {
    const newCity = {
      name: newCityName,
      address: { postCode: parseInt(newPostalCode) },
    };
    setCities([...cities, newCity]);
    setNewCityName('');
    setNewPostalCode('');
  };

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
            />
          )}
          name="phoneNumber"
        />
        {errors.phoneNumber && (
          <ErrorText>{errors.phoneNumber.message}</ErrorText>
        )}
      </View>
      <View>
        <TextInput
          value={newCityName}
          onChangeText={setNewCityName}
          placeholder={t('cityName')}
        />
        <TextInput
          value={newPostalCode}
          keyboardType="numeric"
          onChangeText={handleNewPostalCode}
          placeholder={t('postalCode')}
        />
        <Button title={t('addCity')} onPress={addCity} />

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
      </View>
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
