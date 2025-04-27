"use client";

import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticipantTab from "@/components/discussion/ParticipantTab";
import { DiscussionProvider } from "@/contexts/DiscussionContext";

export default function Discussion() {
  const searchParams = useSearchParams();
  const participantsParam = searchParams.get("participants");
  const participants = participantsParam
    ? decodeURIComponent(participantsParam).split(",")
    : [];

  return (
    <DiscussionProvider initialParticipants={participants}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center p-4">
        <Card className="w-full max-w-4xl shadow-lg h-[calc(100vh-2rem)]">
          <div className="p-6 h-full flex flex-col">
            <Tabs defaultValue={participants[0]} className="w-full flex-1 flex flex-col">
              <TabsList className="w-full flex flex-wrap justify-start">
                {participants.map((participant) => (
                  <TabsTrigger
                    key={participant}
                    value={participant}
                    className="flex-grow"
                  >
                    {participant}
                  </TabsTrigger>
                ))}
              </TabsList>

              {participants.map((participant) => (
                <TabsContent key={participant} value={participant} className="flex-1 flex flex-col">
                  <ParticipantTab participant={participant} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Card>
      </div>
    </DiscussionProvider>
  );
}
