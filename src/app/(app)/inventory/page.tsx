'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RequisitionDialog } from '@/components/inventory/requisition-dialog';
import { inventory } from '@/lib/data';
import type { InventoryItem } from '@/lib/types';

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [itemsToRequisition, setItemsToRequisition] = React.useState<InventoryItem[]>([]);

  const handleOpenRequisition = (items: InventoryItem[]) => {
    setItemsToRequisition(items);
    setIsDialogOpen(true);
  }

  return (
    <>
      <AppHeader title="Inventory Management" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <InventoryTable initialItems={inventory} onOpenRequisition={handleOpenRequisition}/>
      </main>
      <RequisitionDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        items={itemsToRequisition}
      />
    </>
  );
}
