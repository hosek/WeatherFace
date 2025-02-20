import React from 'react';
import * as yup from 'yup';
import { View, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { SignInFormData } from '@/types';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ErrorText } from '@/components/ui/ErrorText';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

export default function SignInForm(props: {
  onSubmit: (data: SignInFormData) => void;
}) {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    email: yup.string().required(t('emailRequired')).email(t('invalidEmail')),
    password: yup
      .string()
      .required(t('passwordRequired'))
      .min(8, t('passwordMinLength')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'john@example.com',
      password: '12345678',
    },
  });
  const { onSubmit } = props;

  return (
    <View>
      <ThemedText>{t('pleaseSignIn')}</ThemedText>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
              value={value}
              onChangeText={onChange}
              placeholder={t('email')}
            />
          )}
          name="email"
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
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
      <Button title={t('signIn')} onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
