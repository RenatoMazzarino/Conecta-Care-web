'use client';

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface TimelineEventItemProps {
  icon: LucideIcon;
  isComplete: boolean;
  isLast: boolean;
}

export function TimelineEventItem({ icon: Icon, isComplete, isLast }: TimelineEventItemProps) {
  return (
    <div className="flex flex-col items-center h-full">
      {/* Círculo e Ícone */}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-card transition-all z-10",
          isComplete ? 'bg-primary text-primary-foreground' : 'bg-muted border'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Linha de Conexão Vertical */}
      {!isLast && (
        <div className="flex-1 w-0.5 bg-border mt-1" />
      )}
    </div>
  );
}
