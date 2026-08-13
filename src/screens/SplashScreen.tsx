import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WhatsAppColors } from '../constants/colors';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💬</Text>
      <Text style={styles.text}>Loading memories...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhatsAppColors.headerBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginTop: 16,
    opacity: 0.8,
  },
});
