'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RequisitionDialog } from '@/components/inventory/requisition-dialog';
import type { InventoryItem, Patient } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { patients as mockPatients, inventory as mockInventory, mockShiftReports, mockNotifications } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [itemsToRequisition, setItemsToRequisition] = React.useState<InventoryItem[]>([]);
  const { toast } = useToast();
  const firestore = useFirestore();
  
  // Assuming we manage inventory for the first patient in the mock data for now
  const firstPatientId = mockPatients[0]?.id;

  const inventoryCollectionRef = useMemoFirebase(() => {
    if (!firestore || !firstPatientId) return null;
    return collection(firestore, 'patients', firstPatientId, 'inventories');
  }, [firestore, firstPatientId]);

  const { data: inventory, isLoading } = useCollection<InventoryItem>(inventoryCollectionRef);

  const handleOpenRequisition = (items: InventoryItem[]) => {
    setItemsToRequisition(items);
    setIsDialogOpen(true);
  };
  
  const handleSeedData = () => {
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
        description: "Enviando dados de simulação para o Firestore."
    });

    const patientsWithInventoryData: Patient[] = mockPatients.map(p => {
        const lowStockCount = mockInventory.filter(item => item.stock > 0 && item.stock <= item.lowStockThreshold).length;
        const criticalStockCount = mockInventory.filter(item => item.stock === 0).length;
        return {
            ...p,
            lowStockCount,
            criticalStockCount
        }
    })

    patientsWithInventoryData.forEach(patient => {
        const patientDocRef = doc(firestore, 'patients', patient.id);
        setDocumentNonBlocking(patientDocRef, patient, { merge: true });

        mockInventory.forEach(item => {
            const itemDocRef = doc(firestore, 'patients', patient.id, 'inventories', item.id);
            setDocumentNonBlocking(itemDocRef, item, { merge: true });
        });

        mockShiftReports.filter(sr => sr.patientId === patient.id).forEach(report => {
            const reportDocRef = doc(firestore, 'patients', patient.id, 'shiftReports', report.id);
            setDocumentNonBlocking(reportDocRef, report, { merge: true });
        })

        mockNotifications.filter(n => n.patientId === patient.id).forEach(notification => {
            const notifDocRef = doc(firestore, 'patients', patient.id, 'notifications', notification.id);
            setDocumentNonBlocking(notifDocRef, notification, { merge: true });
        })
    });

    toast({
        title: "Sucesso!",
        description: `${patientsWithInventoryData.length} pacientes, seus inventários e outros dados foram enviados para o Firestore.`
    });
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
                     <Button onClick={handleSeedData} disabled={isLoading}>
                        Popular Dados de Simulação
                    </Button>
                </div>
            </CardHeader>
        </Card>

        {noData && (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center">
                <div className="text-lg font-semibold mb-2">Inventário do paciente está vazio.</div>
                <p className="mb-4 text-sm text-muted-foreground">
                    Clique no botão acima para popular o banco de dados com dados de simulação. A tabela mostrará o inventário do primeiro paciente ({mockPatients[0]?.name}).
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
