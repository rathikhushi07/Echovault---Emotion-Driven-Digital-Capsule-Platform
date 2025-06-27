import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface MoodData {
  emotion: string;
  intensity: number;
  timestamp: Date;
  keywords: string[];
  color: string;
}

interface MoodContextType {
  currentMood: MoodData;
  moodHistory: MoodData[];
  analyzeMood: (text: string) => MoodData;
  updateMood: (mood: MoodData) => void;
  isAnalyzing: boolean;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: ReactNode;
}

// Mock AI mood analysis - in real app, this would use GPT-4 API
const mockMoodAnalysis = (text: string): MoodData => {
  const emotions = [
    { name: 'joy', keywords: ['happy', 'excited', 'great', 'amazing', 'wonderful'], color: '#f59e0b' },
    { name: 'sadness', keywords: ['sad', 'down', 'depressed', 'cry', 'upset'], color: '#3b82f6' },
    { name: 'anger', keywords: ['angry', 'mad', 'furious', 'hate', 'annoyed'], color: '#ef4444' },
    { name: 'fear', keywords: ['scared', 'afraid', 'worried', 'anxious', 'nervous'], color: '#8b5cf6' },
    { name: 'love', keywords: ['love', 'adore', 'cherish', 'romance', 'heart'], color: '#ec4899' },
    { name: 'hope', keywords: ['hope', 'optimistic', 'future', 'dream', 'wish'], color: '#10b981' },
    { name: 'nostalgia', keywords: ['remember', 'past', 'miss', 'memories', 'childhood'], color: '#f97316' },
    { name: 'calm', keywords: ['peaceful', 'serene', 'quiet', 'meditation', 'zen'], color: '#06b6d4' }
  ];

  const lowerText = text.toLowerCase();
  let detectedEmotion = emotions[0]; // default to joy
  let maxMatches = 0;

  emotions.forEach(emotion => {
    const matches = emotion.keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedEmotion = emotion;
    }
  });

  const intensity = Math.min(0.3 + (maxMatches * 0.2) + (text.length / 500), 1);
  const matchedKeywords = detectedEmotion.keywords.filter(keyword => lowerText.includes(keyword));

  return {
    emotion: detectedEmotion.name,
    intensity,
    timestamp: new Date(),
    keywords: matchedKeywords.length > 0 ? matchedKeywords : [detectedEmotion.name],
    color: detectedEmotion.color
  };
};

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<MoodData>({
    emotion: 'calm',
    intensity: 0.5,
    timestamp: new Date(),
    keywords: ['serene'],
    color: '#06b6d4'
  });
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMood = (text: string): MoodData => {
    setIsAnalyzing(true);
    // Simulate AI processing delay
    setTimeout(() => setIsAnalyzing(false), 1500);
    
    const mood = mockMoodAnalysis(text);
    setCurrentMood(mood);
    setMoodHistory(prev => [...prev, mood].slice(-50)); // Keep last 50 moods
    return mood;
  };

  const updateMood = (mood: MoodData) => {
    setCurrentMood(mood);
    setMoodHistory(prev => [...prev, mood].slice(-50));
  };

  // Generate some initial mood history
  useEffect(() => {
    const sampleTexts = [
      "Feeling grateful for this beautiful morning",
      "Missing my childhood friends today",
      "Excited about the upcoming adventure",
      "Reflecting on peaceful moments by the lake",
      "Worried about tomorrow's presentation"
    ];

    const initialHistory = sampleTexts.map((text, index) => ({
      ...mockMoodAnalysis(text),
      timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000)
    }));

    setMoodHistory(initialHistory);
  }, []);

  return (
    <MoodContext.Provider value={{
      currentMood,
      moodHistory,
      analyzeMood,
      updateMood,
      isAnalyzing
    }}>
      {children}
    </MoodContext.Provider>
  );
};