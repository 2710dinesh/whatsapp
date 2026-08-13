import React from 'react';
import { View, TextInput, StyleSheet, useSafeAreaInsets, Text } from 'react-native';
import { WhatsAppColors, ChatSpacing } from '../constants/colors';

export const InputBar = React.memo(function InputBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.iconText}>😊</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="#BBBFC7"
            editable={false}
          />
          <Text style={styles.iconText}>📎</Text>
        </View>

        <View style={styles.micButton}>
          <Text style={styles.micIconText}>🎤</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: WhatsAppColors.inputBg,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: WhatsAppColors.inputText,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A884',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  iconText: {
    fontSize: 20,
    color: WhatsAppColors.icon,
  },
  micIconText: {
    fontSize: 18,
    color: 'white',
  },
});
