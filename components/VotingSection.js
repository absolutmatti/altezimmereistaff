import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from './Button';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

export default function VotingSection({ voting, postId }) {
  const [localVoting, setLocalVoting] = useState({ ...voting });
  const [selectedOption, setSelectedOption] = useState(voting.userVoted || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (optionId) => {
    if (localVoting.isEnded || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      const updatedOptions = localVoting.options.map(option => {
        if (option.id === optionId) {
          return { ...option, count: option.count + 1 };
        }
        return option;
      });

      setLocalVoting({
        ...localVoting,
        options: updatedOptions,
        totalVotes: localVoting.totalVotes + 1,
        userVoted: optionId,
      });

      setSelectedOption(optionId);

      // Show success message
      Alert.alert(
        "Abstimmung erfolgreich",
        "Deine Stimme wurde gezählt."
      );
    } catch (error) {
      console.error("Error voting:", error);
      
      // Show error message
      Alert.alert(
        "Fehler bei der Abstimmung",
        "Deine Stimme konnte nicht gezählt werden."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localVoting.question}</Text>
        {localVoting.endDate && (
          <Text style={styles.endDate}>
            Endet am {format(new Date(localVoting.endDate), "dd. MMMM yyyy", { locale: de })}
          </Text>
        )}
      </View>
      
      <View style={styles.content}>
        {localVoting.options.map(option => {
          const percentage = 
            localVoting.totalVotes > 0 
              ? Math.round((option.count / localVoting.totalVotes) * 100) 
              : 0;

          const isSelected = selectedOption === option.id;
          const showResults = selectedOption !== null || localVoting.isEnded;

          return (
            <View key={option.id} style={styles.optionContainer}>
              {showResults ? (
                <View>
                  <View style={styles.optionHeader}>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText
                    ]}>
                      {option.text}
                    </Text>
                    <Text style={styles.percentage}>
                      {percentage}% ({option.count})
                    </Text>
                  </View>
                  <ProgressBar progress={percentage} style={styles.progressBar} />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleVote(option.id)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.optionButtonText}>{option.text}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.totalVotes}>
          {localVoting.totalVotes} {localVoting.totalVotes === 1 ? "Stimme" : "Stimmen"} insgesamt
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  endDate: {
    fontSize: 12,
    color: '#71717a',
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  optionContainer: {
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 14,
    color: '#ffffff',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  footer: {
    padding: 16,
    paddingTop: 8,
  },
  totalVotes: {
    fontSize: 12,
    color: '#71717a',
  },
});