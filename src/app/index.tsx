import React, { useState, useEffect } from 'react';
import { View, StyleSheet, InteractionManager, Text } from 'react-native';
import { parseChat } from '../utils/parseChat';
import { buildSenderProfiles } from '../utils/senders';
import { groupMessages } from '../utils/groupMessages';
import { SplashScreen } from '../screens/SplashScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { Message, MessageGroup, SenderProfile } from '../types';

type AppState = 'loading' | 'ready' | 'error';

export default function ChatApp() {
  const [state, setState] = useState<AppState>('loading');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [senders, setSenders] = useState<Record<string, SenderProfile>>({});

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      try {
        // Load chat.txt from assets
        const chatRaw = require('@/assets/chat.txt');
        const text = typeof chatRaw === 'string' ? chatRaw : chatRaw.default;

        // Parse
        const parsed = parseChat(text);
        const senderMap = buildSenderProfiles(parsed);
        const groups = groupMessages(parsed);

        setMessages(parsed);
        setSenders(senderMap);
        setMessageGroups(groups);
        setState('ready');
      } catch (e) {
        console.error('Parse error:', e);
        setState('error');
      }
    });
  }, []);

  if (state === 'loading') {
    return <SplashScreen />;
  }

  if (state === 'error') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load chat</Text>
      </View>
    );
  }

  return <ChatScreen messageGroups={messageGroups} senders={senders} />;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#075E54',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
});
