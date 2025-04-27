import { useDiscussion } from "@/contexts/DiscussionContext";

interface TranscriptionViewProps {
  participant: string;
}

export default function TranscriptionView({
  participant,
}: TranscriptionViewProps) {
  const { getParticipantData } = useDiscussion();
  const { transcripts } = getParticipantData(participant);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border rounded-lg p-2 h-full">
      <div className="h-full overflow-y-auto space-y-4">
        {transcripts.map((entry) => (
          <div key={entry.id} className="border-l-2 border-primary pl-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                {formatTime(entry.timestamp)}
              </span>
              <span>{entry.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
