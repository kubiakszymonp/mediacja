import { Button } from "@/components/ui/button";
import { Mic, MicOff, FileText, List, Lightbulb } from "lucide-react";
import { useState, useCallback } from "react";
import SummaryView from "./SummaryView";
import TranscriptionView from "./TranscriptionView";
import RecommendationsView from "./RecommendationsView";
import { useDiscussion } from "@/contexts/DiscussionContext";
import { toast } from "sonner";
import { audioRecordingService } from "@/services/audioRecordingService";
import { transcriptionService } from "@/services/transcriptionService";

interface ParticipantTabProps {
  participant: string;
}

export default function ParticipantTab({ participant }: ParticipantTabProps) {
  const [viewMode, setViewMode] = useState<
    "summary" | "transcription" | "recommendation"
  >("recommendation");
  const { getParticipantData, setRecording, addTranscript } = useDiscussion();
  const { isRecording } = getParticipantData(participant);

  const handleTranscription = async (audioBlob: Blob) => {
    try {
      // Transkrypcja
      const transcriptionToast = toast.loading("Trwa transkrypcja nagrania...");
      const result = await transcriptionService.transcribeAudio(audioBlob);
      toast.dismiss(transcriptionToast);
      toast.success("Transkrypcja zakończona pomyślnie", {
        duration: 1000,
      });
      await addTranscript(participant, result);
    } catch (error) {
      console.error("Błąd podczas przetwarzania nagrania:", error);
      toast.error("Wystąpił błąd podczas przetwarzania nagrania");
    }
  };

  const handleRecordingToggle = useCallback(async () => {
    try {
      if (!isRecording) {
        await audioRecordingService.startRecording();
        setRecording(participant, true);
      } else {
        const audioBlob = await audioRecordingService.stopRecording();
        setRecording(participant, false);
        await handleTranscription(audioBlob);
      }
    } catch (error) {
      console.error("Błąd podczas obsługi nagrywania:", error);
      toast.error("Wystąpił błąd podczas obsługi nagrywania", {
        duration: 1000,
      });
      setRecording(participant, false);
    }
  }, [isRecording, participant, setRecording, addTranscript]);

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{participant}</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "recommendation" ? "default" : "outline"}
            onClick={() => setViewMode("recommendation")}
            size="sm"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Rekomendacje
          </Button>
          <Button
            variant={viewMode === "summary" ? "default" : "outline"}
            onClick={() => setViewMode("summary")}
            size="sm"
          >
            <List className="h-4 w-4 mr-2" />
            Podsumowanie
          </Button>
          <Button
            variant={viewMode === "transcription" ? "default" : "outline"}
            onClick={() => setViewMode("transcription")}
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Transkrypcja
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 relative">
        <div className="absolute inset-0 overflow-y-auto">
          {viewMode === "summary" ? (
            <SummaryView participant={participant} />
          ) : viewMode === "transcription" ? (
            <TranscriptionView participant={participant} />
          ) : (
            <RecommendationsView participant={participant} />
          )}
        </div>
      </div>

      <div className="shrink-0 mt-4">
        <Button
          onClick={handleRecordingToggle}
          variant={isRecording ? "destructive" : "default"}
          className="w-full"
        >
          {isRecording ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Zatrzymaj nagrywanie
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Rozpocznij nagrywanie
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
