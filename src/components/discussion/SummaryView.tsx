import { useDiscussion } from "@/contexts/DiscussionContext";

interface SummaryViewProps {
  participant: string;
}

export default function SummaryView({ participant }: SummaryViewProps) {
  const { getParticipantData } = useDiscussion();
  const { summary } = getParticipantData(participant);

  return (
    <div className="border rounded-lg p-2 h-full">
      <div className="h-full overflow-y-auto">
        <div dangerouslySetInnerHTML={{ __html: summary || "Brak podsumowania" }} />
      </div>
    </div>
  );
} 