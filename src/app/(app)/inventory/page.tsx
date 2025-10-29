'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RequisitionDialog } from '@/components/inventory/requisition-dialog';
import type { InventoryItem } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { patient } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [itemsToRequisition, setItemsToRequisition] = React.useState<InventoryItem[]>([]);

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

  return (
    <>
      <AppHeader title="Inventory Management" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {!isLoading && inventory && (
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
