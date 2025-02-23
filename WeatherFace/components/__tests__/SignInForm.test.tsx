import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignInForm from '../SignInForm';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SignInForm', () => {
  const mockOnSubmit = jest.fn();

  it('renders the form correctly', () => {
    const { getByTestId,getByPlaceholderText } = render(
      <SignInForm onSubmit={mockOnSubmit} />,
    );

    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('signin-button')).toBeTruthy();
  });

  it('shows validation errors when required fields are empty', async () => {
    const { getByText, getByTestId } = render(<SignInForm onSubmit={mockOnSubmit} />);

    fireEvent.press(getByTestId('signin-button'));

    await waitFor(() => {
        expect(getByText('emailRequired')).toBeTruthy();
        expect(getByText('passwordRequired')).toBeTruthy();
    });
  });

  it('submits the form with valid data', async () => {
    const { getByTestId } = render(
      <SignInForm onSubmit={mockOnSubmit} />,
    );

    fireEvent.changeText(getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(getByTestId('password-input'), '12345678');

   fireEvent.press(getByTestId('signin-button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: '12345678',
      },undefined);
    });
  });
});
