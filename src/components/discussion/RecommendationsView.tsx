import { useDiscussion } from "@/contexts/DiscussionContext";

interface RecommendationsViewProps {
  participant: string;
}

export default function RecommendationsView({ participant }: RecommendationsViewProps) {
  const { getParticipantData } = useDiscussion();
  const { recommendations } = getParticipantData(participant);

  return (
    <div className="border rounded-lg p-2 h-full">
      <div className="h-full overflow-y-auto">
        <div dangerouslySetInnerHTML={{ __html: recommendations || "Brak rekomendacji" }} />
      </div>
    </div>
  );
} 