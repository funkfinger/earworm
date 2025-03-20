"use client";

import { Mascot } from "./Mascot";
import { ThoughtBubble } from "./ThoughtBubble";
import { Button } from "./ui/Button";

interface ConfirmationScreenProps {
  onConfirm: (worked: boolean) => void;
}

export function ConfirmationScreen({ onConfirm }: ConfirmationScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto">
      <Mascot size="md" animation="wiggle" />

      <ThoughtBubble>
        <h2 className="text-xl font-bold mb-2">Did it work?</h2>
        <p className="mb-4">
          Is the earworm gone? Has the replacement song taken over?
        </p>
        <p>
          Let me know if it worked so I can improve my earworm curing skills!
        </p>
      </ThoughtBubble>

      <div className="flex gap-4 mt-2">
        <Button onClick={() => onConfirm(true)} variant="primary" size="lg">
          Yes, it worked!
        </Button>

        <Button onClick={() => onConfirm(false)} variant="outline" size="lg">
          Not quite
        </Button>
      </div>

      <p className="text-sm text-center opacity-70 mt-6 max-w-xs">
        Your feedback helps me find better replacement songs for everyone with
        earworms!
      </p>
    </div>
  );
}
