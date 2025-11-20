'use client';

import * as React from 'react';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RequisitionDialog } from '@/components/inventory/requisition-dialog';
import { mockInventory } from '@/lib/data';
import type { InventoryItem } from '@/lib/types';

export function TabInventory() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [itemsToRequisition, setItemsToRequisition] = React.useState<InventoryItem[]>([]);

  React.useEffect(() => {
    setInventory(mockInventory);
  }, []);

  const handleOpenRequisition = React.useCallback((items: InventoryItem[]) => {
    setItemsToRequisition(items);
    setIsDialogOpen(true);
  }, []);

  return (
    <>
      <InventoryTable initialItems={inventory} onOpenRequisition={handleOpenRequisition} />
      <RequisitionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        items={itemsToRequisition}
      />
    </>
  );
}
