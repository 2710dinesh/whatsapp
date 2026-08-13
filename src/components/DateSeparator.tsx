import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WhatsAppColors, ChatSpacing } from '../constants/colors';

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
    marginVertical: ChatSpacing.separatorMargin,
    paddingHorizontal: ChatSpacing.bubbleMarginH,
  },
  chip: {
    backgroundColor: WhatsAppColors.separator,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  text: {
    fontSize: 12,
    color: WhatsAppColors.separatorText,
    fontWeight: '400',
  },
});
