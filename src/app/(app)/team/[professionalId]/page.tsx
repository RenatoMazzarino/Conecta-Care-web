
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Professional } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Shield, MessageCircle, Edit } from 'lucide-react';
import { TeamProfileTab } from '@/components/team/team-profile-tab';
import { TeamShiftsTab } from '@/components/team/team-shifts-tab';
import { TeamPatientsTab } from '@/components/team/team-patients-tab';
import { TeamFinancialTab } from '@/components/team/team-financial-tab';
import { TeamDocumentsTab } from '@/components/team/team-documents-tab';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

function StarRating({ rating, reviewCount }: { rating: number, reviewCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300'}`} />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})
      </span>
    </div>
  );
}

export default function ProfessionalProfilePage() {
  const params = useParams();
  const router = useRouter();
  const professionalId = params.professionalId as string;
  const firestore = useFirestore();

  const professionalDocRef = useMemoFirebase(() => {
    if (!firestore || !professionalId) return null;
    return doc(firestore, 'professionals', professionalId);
  }, [firestore, professionalId]);

  const { data: professional, isLoading } = useDoc<Professional>(professionalDocRef);

  if (isLoading) {
    return (
        <>
            <AppHeader title="Carregando Perfil..." />
            <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
                <Skeleton className="h-12 w-1/4" />
                <Skeleton className="h-32 w-full" />
                 <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-96 w-full" />
            </main>
        </>
    );
  }

  if (!professional) {
    return (
        <>
            <AppHeader title="Profissional não encontrado" />
            <main className="p-6 max-w-7xl mx-auto text-center">
                <h2 className="text-xl font-semibold">Profissional não encontrado</h2>
                <Button onClick={() => router.push('/team')} className="mt-4">Voltar para Equipe</Button>
            </main>
      </>
    );
  }

  return (
    <>
    <AppHeader title={`Perfil de ${professional.name}`} />
    <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        <Button variant="outline" size="sm" onClick={() => router.push('/team')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
        </Button>
       
       <Card>
           <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-32 w-32 text-4xl border-4 border-background shadow-md">
                    <AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint={professional.avatarHint}/>
                    <AvatarFallback>{professional.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-2">
                        <h1 className="text-3xl font-bold">{professional.name}</h1>
                         <Badge variant={professional.corenStatus === 'active' ? 'secondary' : 'destructive'} className="py-1 px-2">
                            <Shield className="mr-1 h-3 w-3" />
                            COREN {professional.corenStatus === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                        <StarRating rating={professional.rating} reviewCount={professional.reviews.length} />
                    </div>
                    <p className="mt-3 text-muted-foreground max-w-xl mx-auto sm:mx-0">{professional.bio}</p>
                </div>
                <div className="flex gap-2">
                    <Button><MessageCircle className="mr-2 h-4 w-4" />Enviar Mensagem</Button>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Editar Perfil</Button>
                </div>
           </CardContent>
       </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="shifts">Plantões</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
            <TeamProfileTab professional={professional} />
        </TabsContent>
        <TabsContent value="shifts" className="mt-6">
            <TeamShiftsTab />
        </TabsContent>
         <TabsContent value="patients" className="mt-6">
            <TeamPatientsTab />
        </TabsContent>
         <TabsContent value="financial" className="mt-6">
            <TeamFinancialTab />
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
            <TeamDocumentsTab />
        </TabsContent>
      </Tabs>
    </main>
    </>
  );
}
