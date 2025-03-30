import { createContext, useContext, ReactNode, useState } from 'react';
import { summaryService } from '../services/summaryService';

interface TranscriptEntry {
  id: string;
  timestamp: Date;
  text: string;
}

interface SummaryPoint {
  id: string;
  text: string;
  timestamp: Date;
  importance: 'high' | 'medium' | 'low';
}

interface ParticipantData {
  transcripts: TranscriptEntry[];
  summaryPoints: SummaryPoint[];
  isRecording: boolean;
}

interface DiscussionContextType {
  participants: string[];
  participantData: { [key: string]: ParticipantData };
  addTranscript: (participant: string, transcript: Omit<TranscriptEntry, 'id'>) => Promise<void>;
  addSummaryPoint: (participant: string, summaryPoint: Omit<SummaryPoint, 'id'>) => void;
  setRecording: (participant: string, isRecording: boolean) => void;
  getParticipantData: (participant: string) => ParticipantData;
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);

export function DiscussionProvider({ 
  children, 
  initialParticipants 
}: { 
  children: ReactNode;
  initialParticipants: string[];
}) {
  const [participants] = useState<string[]>(initialParticipants);
  const [participantData, setParticipantData] = useState<{ [key: string]: ParticipantData }>(
    initialParticipants.reduce((acc, participant) => ({
      ...acc,
      [participant]: {
        transcripts: [],
        summaryPoints: [],
        isRecording: false
      }
    }), {})
  );

  const addTranscript = async (participant: string, transcript: Omit<TranscriptEntry, 'id'>) => {
    setParticipantData(prev => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        transcripts: [
          ...prev[participant].transcripts,
          {
            ...transcript,
            id: crypto.randomUUID()
          }
        ]
      }
    }));

    try {
      const summary = await summaryService.generateSummary(transcript.text);
      
      summary.points.forEach(point => {
        addSummaryPoint(participant, {
          text: point,
          timestamp: summary.timestamp,
          importance: 'medium'
        });
      });
    } catch (error) {
      console.error('Błąd podczas generowania podsumowania:', error);
    }
  };

  const addSummaryPoint = (participant: string, summaryPoint: Omit<SummaryPoint, 'id'>) => {
    setParticipantData(prev => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        summaryPoints: [
          ...prev[participant].summaryPoints,
          {
            ...summaryPoint,
            id: crypto.randomUUID()
          }
        ]
      }
    }));
  };

  const setRecording = (participant: string, isRecording: boolean) => {
    setParticipantData(prev => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        isRecording
      }
    }));
  };

  const getParticipantData = (participant: string) => {
    return participantData[participant];
  };

  return (
    <DiscussionContext.Provider
      value={{
        participants,
        participantData,
        addTranscript,
        addSummaryPoint,
        setRecording,
        getParticipantData
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
}

export function useDiscussion() {
  const context = useContext(DiscussionContext);
  if (context === undefined) {
    throw new Error('useDiscussion must be used within a DiscussionProvider');
  }
  return context;
} 