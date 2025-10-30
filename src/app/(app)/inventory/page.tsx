'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RequisitionDialog } from '@/components/inventory/requisition-dialog';
import type { InventoryItem, Patient, Professional } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { setDoc, collection, doc } from 'firebase/firestore';
import { patients as mockPatients, inventory as mockInventory, mockShiftReports, mockNotifications, professionals as mockProfessionals, initialShifts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

async function seedCollection(firestore: any, collectionName: string, data: any[]) {
    const collectionRef = collection(firestore, collectionName);
    const promises = data.map(item => {
        const docRef = doc(collectionRef, item.id);
        return setDoc(docRef, item);
    });
    await Promise.all(promises);
}

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [itemsToRequisition, setItemsToRequisition] = React.useState<InventoryItem[]>([]);
  const { toast } = useToast();
  const firestore = useFirestore();
  
  // Use mock data locally, but keep Firestore seeding logic
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setInventory(mockInventory);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  const handleOpenRequisition = (items: InventoryItem[]) => {
    setItemsToRequisition(items);
    setIsDialogOpen(true);
  };
  
  const handleSeedData = async () => {
    if (!firestore) {
        toast({
            title: "Erro",
            description: "Conexão com o Firestore não estabelecida.",
            variant: "destructive"
        });
        return;
    }
    
    toast({
        title: "Populando dados...",
        description: "Enviando dados de simulação para o Firestore. Isso pode levar um momento."
    });

    try {
        await seedCollection(firestore, 'patients', mockPatients);
        await seedCollection(firestore, 'professionals', mockProfessionals);
        await seedCollection(firestore, 'shifts', initialShifts);

        for (const patient of mockPatients) {
            const inventoryWithPatientId = mockInventory.map(item => ({...item, patientId: patient.id}));
            await seedCollection(firestore, `patients/${patient.id}/inventories`, inventoryWithPatientId);
            
            const reportsForPatient = mockShiftReports.filter(sr => sr.patientId === patient.id);
            await seedCollection(firestore, `patients/${patient.id}/shiftReports`, reportsForPatient);
           
            const notificationsForPatient = mockNotifications.filter(n => n.patientId === patient.id);
            await seedCollection(firestore, `patients/${patient.id}/notifications`, notificationsForPatient);
        }

        toast({
            title: "Sucesso!",
            description: `Banco de dados populado com pacientes, profissionais, plantões e mais.`,
            variant: 'default'
        });

    } catch (error: any) {
         toast({
            title: "Erro ao popular dados",
            description: error.message || "Ocorreu um erro desconhecido.",
            variant: "destructive"
        });
    }

    // Also update local state to reflect seeded data immediately
    setInventory(mockInventory);
  }

  const noData = !isLoading && (!inventory || inventory.length === 0);

  return (
    <>
      <div className="sticky top-0 z-30">
        <AppHeader title="Estoque" />
      </div>
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Ferramentas de Desenvolvimento</CardTitle>
                        <CardDescription>Use este botão para popular o Firestore com dados de simulação.</CardDescription>
                    </div>
                     <Button onClick={handleSeedData}>
                        Popular Dados de Simulação
                    </Button>
                </div>
            </CardHeader>
        </Card>

        {noData && (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center">
                <div className="text-lg font-semibold mb-2">Inventário do paciente está vazio.</div>
                <p className="mb-4 text-sm text-muted-foreground">
                    Clique no botão acima para popular o banco de dados com dados de simulação.
                </p>
            </div>
        )}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {!isLoading && inventory && inventory.length > 0 && (
            <InventoryTable initialItems={inventory} onOpenRequisition={handleOpenRequisition}/>
        )}
      </main>
      <RequisitionDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        items={itemsToRequisition}
      />
    </>
  );
}
