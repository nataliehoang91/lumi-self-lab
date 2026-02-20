import { FlashCardView } from "@/components/Bible/FlashCard/FlashCardView";

export default function FlashcardPage() {
  return (
    <div className="min-h-screen pt-14 flex flex-col bg-linear-to-b from-background to-muted/20 w-full">
      <div className="w-full flex flex-col flex-1">
        <FlashCardView />
      </div>
    </div>
  );
}
