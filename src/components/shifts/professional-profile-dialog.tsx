'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Professional } from '@/lib/types';
import { Star, Shield, MessageCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-amber-400 text-amber-400" />
      ))}
      {halfStar && <Star key="half" className="h-5 w-5" style={{ background: 'linear-gradient(to right, #fbbf24 50%, #d1d5db 50%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 fill-gray-300 text-gray-300" />
      ))}
       <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}

export function ProfessionalProfileDialog({
  professional,
  isOpen,
  onOpenChange,
}: {
  professional: Professional;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className={`h-20 w-20 text-3xl font-bold ${professional.avatarColor}`}>
              <AvatarFallback className={`bg-transparent text-white`}>{professional.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-2xl">{professional.name}</DialogTitle>
              <StarRating rating={professional.rating} />
              <Badge variant={professional.corenStatus === 'active' ? 'default' : 'destructive'} className={cn(professional.corenStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                <Shield className="mr-1 h-3 w-3" />
                COREN {professional.corenStatus === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            <div>
                <h4 className="font-semibold mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                    {professional.specialties.map(spec => (
                        <Badge key={spec} variant="secondary" className="bg-secondary/80 text-secondary-foreground">{spec}</Badge>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="font-semibold mb-2">Avaliações Recebidas</h4>
                <div className="space-y-3">
                {professional.reviews.length > 0 ? (
                    professional.reviews.map((review, index) => (
                    <div key={index} className="text-sm p-3 bg-muted/50 rounded-lg">
                        <p className="italic">"{review.quote}"</p>
                        <p className="text-right text-xs text-muted-foreground mt-1">- {review.from}</p>
                    </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma avaliação ainda.</p>
                )}
                </div>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-3 gap-2">
          <Button variant="outline"><XCircle className="mr-2 h-4 w-4" />Reprovar</Button>
          <Button variant="secondary"><MessageCircle className="mr-2 h-4 w-4" />Chat</Button>
          <Button>Aprovar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
