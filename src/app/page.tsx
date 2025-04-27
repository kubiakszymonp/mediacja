import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-gray-800 mb-2">
            Witaj w Systemie Mediacji
          </CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Profesjonalne narzędzie do prowadzenia mediacji online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-600 space-y-4">
            <p>
              Nasz system pomoże Ci przeprowadzić mediację w sposób profesjonalny i efektywny.
              Rozpocznij proces mediacji już dziś!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/participants">
                <Button size="lg" className="w-full sm:w-auto">
                  Rozpocznij Mediację
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
