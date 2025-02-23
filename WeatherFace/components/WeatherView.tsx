import { ActivityIndicator } from 'react-native';
import { ErrorText } from '@/components/ui/ErrorText';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';

type WeatherPropsType = {
  data: any;
  loading: boolean;
  error: string | null;
};

export function WeatherView({ loading, error, data }: WeatherPropsType) {
  const { t } = useTranslation();
  return (
    <>
      {loading && <ActivityIndicator size="large" testID="loading-indicator"/>}
      {error && <ErrorText>{error}</ErrorText>}
      {data && (
        <ThemedView>
          <ThemedText>
            {t('weatherIn')} {data.name}
          </ThemedText>
          <ThemedText>{data.main.temp}°C</ThemedText>
          <ThemedText>{data.weather[0].description}</ThemedText>
          <ThemedText>
            {t('humidity')}: {data.main.humidity}%
          </ThemedText>
          <ThemedText>
            {t('windSpeed')}: {data.wind.speed} m/s
          </ThemedText>
        </ThemedView>
      )}
    </>
  );
}
