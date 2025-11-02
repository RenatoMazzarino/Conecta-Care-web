
'use client';

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface TimelineEventItemProps {
  icon: LucideIcon;
  isComplete: boolean;
}

export function TimelineEventItem({ icon: Icon, isComplete }: TimelineEventItemProps) {
  return (
    <div className="flex h-full items-center justify-center relative w-8">
      {/* Círculo e Ícone */}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-card transition-all z-10",
          isComplete ? 'bg-primary text-primary-foreground' : 'bg-muted border'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
}
