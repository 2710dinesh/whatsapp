import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DateSeparatorProps {
  text: string;
}

export const DateSeparator = React.memo(function DateSeparator({ text }: DateSeparatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.chip}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  chip: {
    backgroundColor: '#00BFA5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
