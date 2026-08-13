import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { ChatSpacing } from '../constants/colors';

interface EmojiMessageProps {
  message: Message;
}

export const EmojiMessage = React.memo(function EmojiMessage({ message }: EmojiMessageProps) {
  return (
    <View
      style={[
        styles.container,
        message.isSent ? styles.sentContainer : styles.receivedContainer,
      ]}
    >
      <Text style={styles.emoji}>{message.text}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: ChatSpacing.bubbleMarginV,
    paddingHorizontal: ChatSpacing.bubbleMarginH,
  },
  sentContainer: {
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 36,
  },
});
