import React, { ReactNode } from 'react';
import { Text, StyleSheet } from 'react-native';

type ErrorTextProps = {
  children: ReactNode;
};

export function ErrorText({ children }: ErrorTextProps) {
  return <Text style={styles.errorText}>{children}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
