import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpForm from '../SignUpForm';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SignUpForm', () => {
  const mockOnSubmit = jest.fn();

  it('renders the form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUpForm onSubmit={mockOnSubmit} />,
    );

    expect(getByPlaceholderText('email')).toBeTruthy();
    expect(getByPlaceholderText('password')).toBeTruthy();
    expect(getByPlaceholderText('confirmPassword')).toBeTruthy();
    expect(getByPlaceholderText('phoneNumber')).toBeTruthy();
    expect(getByText('addNewCity')).toBeTruthy();
    expect(getByText('signUp')).toBeTruthy();
  });

  it('shows validation errors when required fields are empty', async () => {
    const { getByText } = render(<SignUpForm onSubmit={mockOnSubmit} />);

    fireEvent.press(getByText('signUp'));

    await waitFor(() => {
      expect(getByText('emailRequired')).toBeTruthy();
      expect(getByText('passwordRequired')).toBeTruthy();
      expect(getByText('enterPasswordAgain')).toBeTruthy();
      expect(getByText('phoneRequired')).toBeTruthy();
      expect(getByText('minCity')).toBeTruthy();
    });
  });

  it('submits the form with valid data', async () => {
    const { getByPlaceholderText,getByTestId, getByText } = render(
      <SignUpForm onSubmit={mockOnSubmit} />,
    );

    fireEvent.changeText(getByPlaceholderText('email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('password'), '12345678');
    fireEvent.changeText(getByPlaceholderText('confirmPassword'), '12345678');
    fireEvent.changeText(getByPlaceholderText('phoneNumber'), '+420777123456');

    fireEvent.press(getByTestId('addcity-button'));

    fireEvent.changeText(getByTestId('cityname-input'), 'Prague');
    fireEvent.changeText(getByTestId('postcode-input'), '11000');
    fireEvent.press(getByText('Save'));

    fireEvent.press(getByText('signUp'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: '12345678',
        confirmPassword: '12345678',
        phoneNumber: '+420777123456',
        cities: [{ name: 'Prague', address: { postCode: 11000 } }],
      });
    });
  });
});
