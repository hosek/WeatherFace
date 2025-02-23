import React from 'react';
import { render } from '@testing-library/react-native';
import { WeatherView } from '../WeatherView';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('WeatherView', () => {
  it('renders loading indicator when loading', () => {
    const { getByTestId } = render(
      <WeatherView loading={true} error={null} data={null} />,
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error message when there is an error', () => {
    const { getByText } = render(
      <WeatherView loading={false} error="Error message" data={null} />,
    );
    expect(getByText('Error message')).toBeTruthy();
  });

  it('renders weather data when data is available', () => {
    const data = {
      name: 'Prague',
      main: {
        temp: 20,
        humidity: 50,
      },
      weather: [
        {
          description: 'clear sky',
        },
      ],
      wind: {
        speed: 5,
      },
    };

    const { getByText } = render(
      <WeatherView loading={false} error={null} data={data} />,
    );
    expect(getByText('weatherIn Prague')).toBeTruthy();
    expect(getByText('20°C')).toBeTruthy();
    expect(getByText('clear sky')).toBeTruthy();
    expect(getByText('humidity: 50%')).toBeTruthy();
    expect(getByText('windSpeed: 5 m/s')).toBeTruthy();
  });
});
