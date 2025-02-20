import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { WeatherSearch } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Image, StyleSheet, Button } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ErrorText } from '@/components/ui/ErrorText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { WeatherView } from '@/components/WeatherView';
import { useAuth } from '@/hooks/useAuth';
import { useDataContext } from '@/context/DataContext';
import { getWeatherUrlForCity } from '@/constants/WeatherService';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { state } = useAuth();
  const { t } = useTranslation();
  const { data, fetchData, loading, error } = useDataContext();
  const [email, setEmail] = useState('');

  const schema = yup
    .object()
    .shape({ name: yup.string().required(t('cityRequired')) });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WeatherSearch>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (state.user) {
        setEmail(state.user.email);
    }
  }, [state]);

  const handleSearch = async (data: WeatherSearch) => {
    await fetchData(getWeatherUrlForCity(data.name));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#001123', dark: '#001123' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-logo.png')}
          style={styles.faceLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('welcome')}, {email}!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{t('checkWather')}</ThemedText>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
              value={value}
              onChangeText={onChange}
              placeholder={t('cityName')}
            />
          )}
          name="name"
        />
        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        <Button title="Show forecast" onPress={handleSubmit(handleSearch)} />
      </ThemedView>
      <WeatherView data={data} error={error} loading={loading} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  faceLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  error: {
    color: '#FF0000',
  },
});
