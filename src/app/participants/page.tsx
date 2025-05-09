"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [participants, setParticipants] = useState<string[]>([]);
  const router = useRouter();

  const addParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const removeParticipant = (index: number) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = () => {
    const validParticipants = participants.filter(p => p.trim() !== "");
    if (validParticipants.length < 2) {
      alert("Dodaj minimum dwóch uczestników!");
      return;
    }
    const participantsQuery = validParticipants.join(',');
    router.push(`/discussion?participants=${encodeURIComponent(participantsQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Uczestnicy mediacji</h1>
          <p className="text-gray-600 text-center mb-6">Dodaj uczestników, którzy będą brać udział w mediacji</p>
          
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Nazwa uczestnika"
                  value={participant}
                  onChange={(e) => updateParticipant(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeParticipant(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              onClick={addParticipant}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj uczestnika
            </Button>

            <Button 
              onClick={handleSubmit}
              className="w-full"
              variant="default"
            >
              Rozpocznij dyskusję
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
