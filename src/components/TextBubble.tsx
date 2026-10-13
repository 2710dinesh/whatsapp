import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Message } from '../types';
import { WhatsAppColors, ChatSpacing } from '../constants/colors';
import { formatMessageTime } from '../utils/dateFormatter';
import { HighlightedText } from './HighlightedText';

interface TextBubbleProps {
  message: Message;
  senderName?: string;
  senderColor?: string;
  showSenderName?: boolean;
  searchQuery?: string;
  isCurrentResult?: boolean;
}

export const TextBubble = React.memo(function TextBubble({
  message,
  senderName,
  senderColor = WhatsAppColors.senderName,
  showSenderName = false,
  searchQuery = '',
  isCurrentResult = false,
}: TextBubbleProps) {
  const { width } = useWindowDimensions();
  const maxWidth = Math.round(width * 0.75);

  if (message.type === 'deleted') {
    return (
      <View
        style={[
          styles.container,
          message.isSent ? styles.sentContainer : styles.receivedContainer,
        ]}
      >
        <View
          style={[
            styles.bubble,
            message.isSent ? styles.sentBubble : styles.receivedBubble,
            { maxWidth },
          ]}
        >
          <Text style={[styles.text, styles.deletedText]}>
            <Text style={styles.deletedIcon}>⊘ </Text>
            This message was deleted
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        message.isSent ? styles.sentContainer : styles.receivedContainer,
      ]}
    >
      {!message.isSent && showSenderName && senderName && (
        <Text style={[styles.senderName, { color: senderColor }]}>{senderName}</Text>
      )}
      <View
        style={[
          styles.bubble,
          message.isSent ? styles.sentBubble : styles.receivedBubble,
          isCurrentResult && styles.currentResultBubble,
          { maxWidth },
        ]}
      >
        {searchQuery ? (
          <HighlightedText
            text={message.text}
            searchQuery={searchQuery}
            style={[styles.text, message.isSent ? styles.sentText : styles.receivedText]}
          />
        ) : (
          <Text style={[styles.text, message.isSent ? styles.sentText : styles.receivedText]}>
            {message.text}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{formatMessageTime(message.timestamp)}</Text>
          {message.isSent && <Text style={styles.ticks}>✓✓</Text>}
        </View>
      </View>
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
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    marginBottom: 4,
  },
  bubble: {
    borderRadius: WhatsAppColors.borderRadius,
    padding: 8,
    paddingVertical: ChatSpacing.messagePaddingV,
    paddingHorizontal: ChatSpacing.messagePaddingH,
  },
  sentBubble: {
    backgroundColor: WhatsAppColors.sentBubble,
    borderTopRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: WhatsAppColors.receivedBubble,
    borderTopLeftRadius: 0,
  },
  currentResultBubble: {
    borderWidth: 2,
    borderColor: '#FFEB3B',
  },
  text: {
    fontSize: 14.5,
    lineHeight: 20,
  },
  sentText: {
    color: WhatsAppColors.sentText,
  },
  receivedText: {
    color: WhatsAppColors.receivedText,
  },
  deletedText: {
    fontStyle: 'italic',
    color: WhatsAppColors.timestamp,
  },
  deletedIcon: {
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
    color: WhatsAppColors.timestamp,
  },
  ticks: {
    fontSize: 11,
    color: WhatsAppColors.ticks,
    fontWeight: '600',
  },
});
