import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ListRenderItemInfo,
  useWindowDimensions,
} from 'react-native';
import { Message, MessageGroup, SenderProfile } from '../types';
import { MessageBubble } from '../components/MessageBubble';
import { ChatHeader } from '../components/ChatHeader';
import { InputBar } from '../components/InputBar';
import { WhatsAppColors } from '../constants/colors';

interface ChatScreenProps {
  messageGroups: MessageGroup[];
  senders: Record<string, SenderProfile>;
}

export const ChatScreen = React.memo(function ChatScreen({
  messageGroups,
  senders,
}: ChatScreenProps) {
  const { width } = useWindowDimensions();
  const receiverName = useMemo(() => {
    // Find first non-Dinesh sender
    for (const group of messageGroups) {
      if (group.sender !== 'SYSTEM' && !senders[group.sender]?.isYou) {
        return group.sender;
      }
    }
    return 'Diya';
  }, [messageGroups, senders]);

  const renderMessage = (info: ListRenderItemInfo<MessageGroup>) => {
    const group = info.item;

    if (group.sender === 'SYSTEM') {
      // System messages (including date separators) - render all at once
      return group.messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          senderProfile={senders[msg.sender]}
          showSenderName={false}
        />
      ));
    }

    // Regular message group
    return (
      <View key={group.id}>
        {group.messages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            senderProfile={senders[msg.sender]}
            showSenderName={index === 0 && !msg.isSent}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader contactName={receiverName} />

      <FlatList
        data={messageGroups}
        renderItem={({ item }) => renderMessage({ item } as any)}
        keyExtractor={(item) => item.id}
        inverted={true}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        windowSize={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <InputBar />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WhatsAppColors.chatBg,
  },
  list: {
    flex: 1,
    backgroundColor: WhatsAppColors.chatBg,
  },
  listContent: {
    paddingVertical: 8,
  },
});
