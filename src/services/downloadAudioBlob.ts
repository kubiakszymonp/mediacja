export const downloadAudioBlob = (audioBlob: Blob) => {
  try {
    // Tworzymy URL dla pliku audio
    const audioUrl = URL.createObjectURL(audioBlob);

    // Tworzymy link do pobrania
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `nagranie-${new Date().toISOString()}.webm`;

    // Dodajemy link do dokumentu i klikamy go
    document.body.appendChild(link);
    link.click();

    // Czyścimy
    document.body.removeChild(link);
    URL.revokeObjectURL(audioUrl);

    // Zwracamy przykładowy tekst
    return {
      text: "To jest przykładowy tekst transkrypcji. W rzeczywistej implementacji ten tekst byłby wynikiem przetwarzania przez OpenAI Whisper.",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Błąd podczas mock transkrypcji:", error);
    throw error;
  }
};
