import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface SearchBarProps {
  onSearch: (query: string, date: string | null) => void;
  onDone: () => void;
  resultCount: number;
  currentResultIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const SearchBar = React.memo(function SearchBar({
  onSearch,
  onDone,
  resultCount,
  currentResultIndex,
  onPrevious,
  onNext,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text, selectedDate);
  };

  const handleDateSelect = (day: string) => {
    console.log('📅 Calendar date selected:', day);
    setSelectedDate(day);
    onSearch(searchQuery, day);
    setShowCalendar(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.icon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        <Pressable
          style={styles.calendarButton}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={styles.calendarIcon}>📅</Text>
        </Pressable>
      </View>
      {searchQuery.trim() && resultCount > 0 ? (
        <View style={styles.resultBar}>
          <Text style={styles.resultCount}>
            {currentResultIndex + 1} / {resultCount}
          </Text>
          <View style={styles.navButtons}>
            <Pressable
              style={styles.navButton}
              onPress={onPrevious}
              disabled={currentResultIndex === 0}
            >
              <Text style={styles.arrowText}>↑</Text>
            </Pressable>
            <Pressable
              style={styles.navButton}
              onPress={onNext}
              disabled={currentResultIndex === resultCount - 1}
            >
              <Text style={styles.arrowText}>↓</Text>
            </Pressable>
          </View>
          <Pressable style={styles.doneButton} onPress={onDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      ) : null}
      {showCalendar ? (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showCalendar}
          onRequestClose={() => setShowCalendar(false)}
        >
          <Pressable
            style={styles.calendarOverlay}
            onPress={() => setShowCalendar(false)}
          >
            <View style={styles.calendarContainer}>
              <Calendar
                key={selectedDate ?? 'default'}
                current={selectedDate ?? undefined}
                onDayPress={(day) => handleDateSelect(day.dateString)}
                markedDates={
                  selectedDate
                    ? { [selectedDate]: { selected: true, selectedColor: '#00A884' } }
                    : {}
                }
                theme={{
                  backgroundColor: '#1E272C',
                  calendarBackground: '#1E272C',
                  textSectionTitleColor: '#FFFFFF',
                  textSectionTitleDisabledColor: '#666',
                  selectedDayBackgroundColor: '#00A884',
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: '#00A884',
                  dayTextColor: '#FFFFFF',
                  textDisabledColor: '#666',
                  dotColor: '#00A884',
                  selectedDotColor: '#FFFFFF',
                  monthTextColor: '#FFFFFF',
                  indicatorColor: '#00A884',
                  arrowColor: '#00A884',
                }}
              />
            </View>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E272C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A4A5A',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  calendarButton: {
    padding: 8,
    borderRadius: 8,
  },
  calendarIcon: {
    fontSize: 20,
  },
  resultBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingVertical: 8,
  },
  resultCount: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '500',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    padding: 6,
  },
  arrowText: {
    fontSize: 14,
    color: '#00A884',
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#00A884',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#1E272C',
    borderRadius: 12,
    padding: 16,
    maxWidth: 350,
    minWidth: 300,
  },
});
