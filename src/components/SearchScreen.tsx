import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, ListRenderItemInfo } from 'react-native';
import { Svg, Polyline } from 'react-native-svg';
import { MessageBubble } from './MessageBubble';
import { Message, MessageGroup, SenderProfile } from '../types';

interface SearchScreenProps {
  messageGroups: MessageGroup[];
  senders: Record<string, SenderProfile>;
  onClose: () => void;
}

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
);

const UpIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="2">
    <Polyline points="18 15 12 9 6 15" />
  </Svg>
);

const DownIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="2">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);

export const SearchScreen = React.memo(function SearchScreen({
  messageGroups,
  senders,
  onClose,
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const allMessages = useMemo(() => {
    return messageGroups.flatMap(group => group.messages);
  }, [messageGroups]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allMessages.filter(msg =>
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allMessages]);

  const currentResult = searchResults[currentResultIndex];

  const messagesWithContext = useMemo(() => {
    if (!currentResult) return [];

    const currentIndex = allMessages.findIndex(msg => msg.id === currentResult.id);
    const start = Math.max(0, currentIndex - 5);
    const end = Math.min(allMessages.length, currentIndex + 6);

    return allMessages.slice(start, end);
  }, [currentResult, allMessages]);

  const renderMessage = (info: ListRenderItemInfo<Message>) => {
    const msg = info.item;
    const isHighlighted = currentResult && msg.id === currentResult.id;

    const group = messageGroups.find(g => g.messages.some(m => m.id === msg.id));
    if (!group) return null;

    return (
      <View
        key={msg.id}
        style={[
          styles.messageWrapper,
          isHighlighted && styles.highlightedMessage,
        ]}
      >
        <MessageBubble
          message={msg}
          senderProfile={senders[msg.sender]}
          showSenderName={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <Pressable style={styles.backButton} onPress={onClose}>
          <BackIcon />
        </Pressable>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentResultIndex(0);
          }}
          autoFocus
        />
      </View>

      {/* Result Counter and Navigation */}
      {searchQuery.trim() && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultCountText}>
            {searchResults.length > 0
              ? `${currentResultIndex + 1} of ${searchResults.length}`
              : 'No matches'}
          </Text>

          <View style={styles.navButtons}>
            <Pressable
              style={styles.navButton}
              onPress={() => setCurrentResultIndex(Math.max(0, currentResultIndex - 1))}
              disabled={currentResultIndex === 0}
            >
              <UpIcon />
            </Pressable>

            <Pressable
              style={styles.navButton}
              onPress={() => setCurrentResultIndex(Math.min(searchResults.length - 1, currentResultIndex + 1))}
              disabled={currentResultIndex === searchResults.length - 1}
            >
              <DownIcon />
            </Pressable>
          </View>
        </View>
      )}

      {/* Messages with Context */}
      <FlatList
        data={messagesWithContext}
        renderItem={({ item }) => renderMessage({ item } as any)}
        keyExtractor={(item) => item.id}
        inverted={true}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        scrollEnabled={messagesWithContext.length > 5}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'column',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E272C',
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A4A5A',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 14,
  },
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E272C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A4A5A',
  },
  resultCountText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    padding: 4,
  },
  list: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listContent: {
    paddingVertical: 8,
  },
  messageWrapper: {
    backgroundColor: 'transparent',
  },
  highlightedMessage: {
    backgroundColor: 'rgba(0, 168, 132, 0.1)',
  },
});
