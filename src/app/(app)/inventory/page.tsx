
'use client';

import * as React from 'react';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RequisitionDialog } from '@/components/inventory/requisition-dialog';
import type { InventoryItem } from '@/lib/types';
import { patients as mockPatients, inventory as mockInventory, mockShiftReports, mockNotifications, professionals as mockProfessionals, initialShifts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Firestore related imports are removed as we are disconnecting Firebase.
// import { useFirestore } from '@/firebase';
// import { setDoc, collection, doc } from 'firebase/firestore';
// import { Firestore } from 'firebase/firestore';


// This function is commented out as it depends on Firestore.
// async function seedCollection(firestore: Firestore, collectionName: string, data: any[]) {
//     const collectionRef = collection(firestore, collectionName);
//     const promises = data.map(item => {
//         const docRef = doc(collectionRef, item.id);
//         return setDoc(docRef, item);
//     });
//     await Promise.all(promises);
// }

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [itemsToRequisition, setItemsToRequisition] = React.useState<InventoryItem[]>([]);
  const { toast } = useToast();
  // const firestore = useFirestore(); // Disconnecting Firebase
  
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
    // This functionality is disabled as we are disconnecting from Firebase.
    toast({
        title: "Funcionalidade Desativada",
        description: "A conexão com o Firestore está temporariamente desativada.",
        variant: "destructive"
    });
    // Also update local state to reflect seeded data immediately
    setInventory(mockInventory);
  }

  const noData = !isLoading && (!inventory || inventory.length === 0);

  return (
    <>
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Ferramentas de Desenvolvimento</CardTitle>
                        <CardDescription>Use este botão para popular o sistema com dados de simulação.</CardDescription>
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
      <RequisitionDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        items={itemsToRequisition}
      />
    </>
  );
}
