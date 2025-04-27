import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  summaryService,
} from "../services/summaryService";
import { recommendationsService } from "../services/recommendationsService";

interface TranscriptEntry {
  id: string;
  timestamp: Date;
  text: string;
  participant: string;
}

interface ParticipantSummaryPayload {
  participantName: string;
  currentSummary: string;
  lastTenMessages: {
    participant: string;
    text: string;
    timestamp: Date;
  }[];
}

interface ParticipantData {
  transcripts: TranscriptEntry[];
  isRecording: boolean;
  summary: string;
  recommendations: string;
}

interface DiscussionContextType {
  participants: string[];
  participantData: { [key: string]: ParticipantData };
  addTranscript: (
    participant: string,
    transcript: Omit<TranscriptEntry, "id" | "participant">
  ) => Promise<void>;
  setRecording: (participant: string, isRecording: boolean) => void;
  getParticipantData: (participant: string) => ParticipantData;
  setParticipantSummary: (participant: string, summary: string) => void;
  generateRecommendations: () => Promise<void>;
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(
  undefined
);

export function DiscussionProvider({
  children,
  initialParticipants,
}: {
  children: ReactNode;
  initialParticipants: string[];
}) {
  const [participants] = useState<string[]>(initialParticipants);
  const [participantData, setParticipantData] = useState<{
    [key: string]: ParticipantData;
  }>(
    initialParticipants.reduce(
      (acc, participant) => ({
        ...acc,
        [participant]: {
          transcripts: [],
          isRecording: false,
          currentSummary: "",
          recommendations: "",
        },
      }),
      {}
    )
  );

  // Ref do przechowywania aktualnego stanu
  const participantDataRef = useRef(participantData);

  // Aktualizacja ref przy każdej zmianie stanu
  useEffect(() => {
    participantDataRef.current = participantData;
  }, [participantData]);

  const updateParticipantSummary = async (participant: string) => {
    try {
      const currentData = participantDataRef.current;
      
      // Zbieramy wszystkie transkrypcje od wszystkich uczestników
      const allTranscripts = Object.entries(currentData)
        .flatMap(([participantName, data]) => 
          data.transcripts.map(transcript => ({
            ...transcript,
            participant: participantName
          }))
        )
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 20)
        .reverse(); // Sortujemy od najstarszej do najnowszej

      const payload: ParticipantSummaryPayload = {
        participantName: participant,
        currentSummary: currentData[participant].summary,
        lastTenMessages: allTranscripts,
      };

      const summary = await summaryService.generateSummary(payload);

      setParticipantData((prev) => ({
        ...prev,
        [participant]: {
          ...prev[participant],
          summary: summary.text,
        },
      }));

      setTimeout(() => {
        generateRecommendations();
      }, 100);
    } catch (error) {
      console.error("Błąd podczas aktualizacji podsumowania:", error);
    }
  };

  const addTranscript = async (
    participant: string,
    transcript: Omit<TranscriptEntry, "id" | "participant">
  ) => {
    // Aktualizujemy stan
    setParticipantData((prev) => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        transcripts: [
          ...prev[participant].transcripts,
          {
            ...transcript,
            id: crypto.randomUUID(),
            participant,
          },
        ],
      },
    }));

    // Używamy setTimeout aby dać Reactowi czas na aktualizację stanu
    setTimeout(() => {
      updateParticipantSummary(participant);
    }, 0);
  };

  const setRecording = (participant: string, isRecording: boolean) => {
    setParticipantData((prev) => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        isRecording,
      },
    }));
  };

  const getParticipantData = (participant: string) => {
    return participantData[participant];
  };

  const setParticipantSummary = (participant: string, summary: string) => {
    setParticipantData((prev) => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        summary,
      },
    }));
  };

  const generateRecommendations = async () => {
    try {
      const currentData = participantDataRef.current;
      const allSummaries = participants.map((participant) => ({
        participant,
        summary: currentData[participant].summary,
      }));

      // Generuj rekomendacje równolegle dla wszystkich uczestników
      const recommendationPromises = participants.map(async (participant) => {
        const payload = {
          targetParticipant: participant,
          allSummaries,
        };

        const recommendations = await recommendationsService.generateRecommendations(payload);
        return { participant, recommendations: recommendations.text };
      });

      const results = await Promise.all(recommendationPromises);

      // Aktualizuj stan dla wszystkich uczestników na raz
      setParticipantData((prev) => {
        const newData = { ...prev };
        results.forEach(({ participant, recommendations }) => {
          newData[participant] = {
            ...newData[participant],
            recommendations,
          };
        });
        return newData;
      });
    } catch (error) {
      console.error("Błąd podczas generowania rekomendacji:", error);
    }
  };

  return (
    <DiscussionContext.Provider
      value={{
        participants,
        participantData,
        addTranscript,
        setRecording,
        getParticipantData,
        setParticipantSummary,
        generateRecommendations,
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
}

export function useDiscussion() {
  const context = useContext(DiscussionContext);
  if (context === undefined) {
    throw new Error("useDiscussion must be used within a DiscussionProvider");
  }
  return context;
}
