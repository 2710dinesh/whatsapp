import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HighlightedTextProps {
  text: string;
  searchQuery: string;
  style?: any;
}

export const HighlightedText = React.memo(function HighlightedText({
  text,
  searchQuery,
  style,
}: HighlightedTextProps) {
  if (!searchQuery.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));

  return (
    <Text style={style}>
      {parts.map((part, idx) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <Text key={idx} style={[style, styles.highlight]}>
            {part}
          </Text>
        ) : (
          <Text key={idx}>{part}</Text>
        )
      )}
    </Text>
  );
});

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: '#FFEB3B',
    color: '#000',
  },
});
