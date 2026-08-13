import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { WhatsAppColors, ChatSpacing } from '../constants/colors';

interface SystemMessageProps {
  message: Message;
}

export const SystemMessage = React.memo(function SystemMessage({ message }: SystemMessageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.chip}>
        <Text style={styles.text}>{message.text}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: ChatSpacing.separatorMargin,
    paddingHorizontal: ChatSpacing.bubbleMarginH,
  },
  chip: {
    backgroundColor: WhatsAppColors.systemBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    color: WhatsAppColors.systemText,
    textAlign: 'center',
  },
});
