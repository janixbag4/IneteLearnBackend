// app/quiz.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_URL } from '../inetelearn-backend/config/api'; // ← FIXED import path


interface QuizWord {
  _id: string;
  inete: string;
  hiligaynon: string;
  english: string;
}

type QuizMode = 'inete-english' | 'english-inete' | 'hiligaynon-inete';

export default function QuizScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>('english-inete');
  
  const [questions, setQuestions] = useState<{
    word: string;
    correctAnswer: string;
    options: string[];
    correctIndex: number;
  }[]>([]);

  const quizModes = [
    { key: 'english-inete' as QuizMode, label: 'English → Inete', icon: '🇺🇸🌿' },
    { key: 'inete-english' as QuizMode, label: 'Inete → English', icon: '🌿🇺🇸' },
    { key: 'hiligaynon-inete' as QuizMode, label: 'Hiligaynon → Inete', icon: '🇵🇭🌿' },
  ];

  const generateQuiz = async () => {
    setIsLoading(true);
    try {
      // Fetch random words from dictionary
      const response = await fetch(`${API_URL}/api/dictionary?limit=50`);
      const allWords: QuizWord[] = await response.json();

      if (allWords.length < 4) {
        Alert.alert('Not Enough Words', 'Please add more words to the dictionary first.');
        setIsLoading(false);
        return;
      }

      // Shuffle and take 10 questions
      const shuffled = allWords.sort(() => Math.random() - 0.5);
      const quizWords = shuffled.slice(0, Math.min(10, allWords.length));

      const [fromLang, toLang] = quizMode.split('-') as [keyof QuizWord, keyof QuizWord];

      const generatedQuestions = quizWords.map((word) => {
        // Get 3 wrong answers
        const wrongAnswers = shuffled
          .filter((w) => w._id !== word._id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((w) => w[toLang]);

        // Combine with correct answer and shuffle
        const options = [...wrongAnswers, word[toLang]].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(word[toLang]);

        return {
          word: word[fromLang],
          correctAnswer: word[toLang],
          options,
          correctIndex,
        };
      });

      setQuestions(generatedQuestions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Quiz generation error:', error);
      Alert.alert('Error', 'Failed to generate quiz. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);

    if (index === questions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }

    // Wait 1 second before moving to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuestions([]);
  };

  if (!quizStarted) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.setupContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="school" size={80} color="#8B4513" />
            <ThemedText style={styles.title}>Quiz</ThemedText>
            <ThemedText style={styles.subtitle}>
              Test your Inete language knowledge
            </ThemedText>
          </View>

          {/* Quiz Mode Selection */}
          <View style={styles.modeSection}>
            <ThemedText style={styles.sectionTitle}>Select Quiz Mode</ThemedText>
            {quizModes.map((mode) => (
              <TouchableOpacity
                key={mode.key}
                style={[
                  styles.modeCard,
                  quizMode === mode.key && styles.modeCardActive,
                ]}
                onPress={() => setQuizMode(mode.key)}>
                <ThemedText style={styles.modeIcon}>{mode.icon}</ThemedText>
                <ThemedText
                  style={[
                    styles.modeLabel,
                    quizMode === mode.key && styles.modeLabelActive,
                  ]}>
                  {mode.label}
                </ThemedText>
                {quizMode === mode.key && (
                  <Ionicons name="checkmark-circle" size={24} color="#8B4513" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={32} color="#8B4513" />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoTitle}>How it works</ThemedText>
              <ThemedText style={styles.infoText}>
                • 10 multiple choice questions{'\n'}
                • Choose the correct translation{'\n'}
                • Earn points for each correct answer{'\n'}
                • Learn from your mistakes
              </ThemedText>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={[styles.startButton, isLoading && styles.startButtonDisabled]}
            onPress={generateQuiz}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="play" size={24} color="#fff" />
                <ThemedText style={styles.startButtonText}>Start Quiz</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <ThemedView style={styles.container}>
        <View style={styles.resultContainer}>
          <Ionicons
            name={passed ? 'trophy' : 'ribbon'}
            size={100}
            color={passed ? '#FFD700' : '#8B4513'}
          />
          <ThemedText style={styles.resultTitle}>
            {passed ? 'Excellent!' : 'Good Try!'}
          </ThemedText>
          <ThemedText style={styles.scoreText}>
            You scored {score} out of {questions.length}
          </ThemedText>
          <ThemedText style={styles.percentageText}>{percentage}%</ThemedText>

          <View style={styles.resultCard}>
            <ThemedText style={styles.resultMessage}>
              {passed
                ? 'Great job! You have a good understanding of the Inete language.'
                : 'Keep practicing! Every quiz helps you learn more.'}
            </ThemedText>
          </View>

          <View style={styles.resultButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={generateQuiz}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={restartQuiz}>
              <Ionicons name="home" size={20} color="#8B4513" />
              <ThemedText style={styles.backButtonText}>Back to Menu</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    );
  }

  const question = questions[currentQuestion];

  return (
    <ThemedView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
        <ThemedText style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </ThemedText>
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Ionicons name="star" size={24} color="#FFD700" />
        <ThemedText style={styles.scoreLabel}>Score: {score}</ThemedText>
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <ThemedText style={styles.questionLabel}>Translate this word:</ThemedText>
        <ThemedText style={styles.questionWord}>{question.word}</ThemedText>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctIndex;
          const showCorrect = selectedAnswer !== null && isCorrect;
          const showWrong = selectedAnswer !== null && isSelected && !isCorrect;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                showCorrect && styles.optionCorrect,
                showWrong && styles.optionWrong,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}>
              <ThemedText
                style={[
                  styles.optionText,
                  (showCorrect || showWrong) && styles.optionTextWhite,
                ]}>
                {option}
              </ThemedText>
              {showCorrect && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
              {showWrong && <Ionicons name="close-circle" size={24} color="#fff" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF0',
  },
  setupContainer: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 8,
  },
  modeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginBottom: 12,
    gap: 12,
  },
  modeCardActive: {
    backgroundColor: '#F5F5DC',
    borderColor: '#8B4513',
    borderWidth: 3,
  },
  modeIcon: {
    fontSize: 24,
  },
  modeLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4E37',
  },
  modeLabelActive: {
    color: '#8B4513',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8DC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginBottom: 24,
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#5D4E37',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 12,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    padding: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#D2B48C',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B4513',
  },
  progressText: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4E37',
  },
  questionCard: {
    backgroundColor: '#FFF8DC',
    margin: 16,
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D2B48C',
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 16,
  },
  questionWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5D4E37',
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8DC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
  },
  optionCorrect: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionWrong: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4E37',
    flex: 1,
  },
  optionTextWhite: {
    color: '#fff',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginTop: 24,
  },
  scoreText: {
    fontSize: 20,
    color: '#8B4513',
    marginTop: 16,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: '#FFF8DC',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D2B48C',
    marginTop: 24,
    marginBottom: 32,
  },
  resultMessage: {
    fontSize: 16,
    color: '#5D4E37',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultButtons: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B4513',
    gap: 8,
  },
  backButtonText: {
    color: '#8B4513',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
