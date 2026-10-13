import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Circle, Path, Line } from 'react-native-svg';
import { WhatsAppColors, ChatSpacing } from '../constants/colors';

const EmojiIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="#AAAAAA">
    <Circle cx="12" cy="12" r="10" fill="none" stroke="#AAAAAA" strokeWidth="2"/>
    <Circle cx="9" cy="9" r="1.5" fill="#AAAAAA"/>
    <Circle cx="15" cy="9" r="1.5" fill="#AAAAAA"/>
    <Path d="M9 15c1 1 2.5 1.5 3 1.5s2-.5 3-1.5" stroke="#AAAAAA" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </Svg>
);

const AttachmentIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 0 19.8 4.3M22 12.5a10 10 0 0 0-19.8-4.2"/>
  </Svg>
);

const MicrophoneIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <Line x1="12" y1="19" x2="12" y2="23"/>
    <Line x1="8" y1="23" x2="16" y2="23"/>
  </Svg>
);

export const InputBar = React.memo(function InputBar() {
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.iconButton}>
          <EmojiIcon />
        </View>

        <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="#BBBFC7"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <View style={styles.iconButton}>
            <AttachmentIcon />
          </View>
        </View>

        <View style={styles.micButton}>
          <MicrophoneIcon />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: WhatsAppColors.inputBg,
    paddingHorizontal: 8,
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
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: '#0084FF',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#AAAAAA',
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A884',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
});
