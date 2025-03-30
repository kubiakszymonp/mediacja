import { useDiscussion } from "@/contexts/DiscussionContext";

interface SummaryPointsProps {
  participant: string;
}

export default function SummaryPoints({ participant }: SummaryPointsProps) {
  const { getParticipantData } = useDiscussion();
  const { summaryPoints } = getParticipantData(participant);

  return (
    <div className="border rounded-lg p-2 h-full">
      <div className="h-full overflow-y-auto">
        <ul className="space-y-3 list-disc pl-5">
          {summaryPoints.map((point) => (
            <li key={point.id} className={`${
              point.importance === 'high' ? 'text-red-500' :
              point.importance === 'medium' ? 'text-yellow-500' :
              'text-green-500'
            }`}>
              {point.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 