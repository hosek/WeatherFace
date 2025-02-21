import React, { useState, useCallback } from 'react';
import { StyleSheet, Button, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { SignUpFormData, SignInFormData } from '@/types';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import { useAuth } from '@/hooks/useAuth';

const AuthScreen = () => {
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignIn = useCallback(async (formData: SignInFormData) => {
    await signIn(formData);
    router.replace('/(tabs)');
  }, []);

  const handleSignUp = useCallback(async (formData: SignUpFormData) => {
    await signUp(formData);
    router.replace('/(tabs)');
  }, []);

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
      {showSignUp ? (
        <SignUpForm onSubmit={handleSignUp} />
      ) : (
        <>
          <SignInForm onSubmit={handleSignIn} />
          <ThemedView style={styles.stepContainer}>
            <ThemedText>{t('noAccount')}</ThemedText>
            <Button title={t('signUp')} onPress={() => setShowSignUp(true)} />
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
};

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
});

export default AuthScreen;
