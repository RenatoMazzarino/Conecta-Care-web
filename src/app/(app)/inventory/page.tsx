'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RequisitionDialog } from '@/components/inventory/requisition-dialog';
import type { InventoryItem } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { patient, inventory as mockInventory } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [itemsToRequisition, setItemsToRequisition] = React.useState<InventoryItem[]>([]);
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const inventoryCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'patients', patient.id, 'inventories');
  }, [firestore]);

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
        description: "Enviando itens de simulação para o Firestore."
    });

    mockInventory.forEach(item => {
        const itemDocRef = doc(firestore, 'patients', patient.id, 'inventories', item.id);
        // Using non-blocking update
        setDocumentNonBlocking(itemDocRef, item, { merge: true });
    });

    toast({
        title: "Sucesso!",
        description: "Dados de inventário foram enviados para o Firestore."
    });
  }

  const showSeedButton = !isLoading && (!inventory || inventory.length === 0);

  return (
    <>
      <AppHeader title="Inventory Management" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        {showSeedButton && (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground bg-card p-12 text-center">
                <div className="text-lg font-semibold mb-2">Seu inventário está vazio.</div>
                <p className="mb-4 text-sm text-muted-foreground">
                    Clique no botão abaixo para popular o banco de dados com dados de simulação.
                </p>
                <Button onClick={handleSeedData}>
                    Popular Dados de Inventário
                </Button>
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
