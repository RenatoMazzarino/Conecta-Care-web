'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

function getStockStatus(item: InventoryItem): {
  variant: 'default' | 'secondary' | 'destructive';
  text: string;
} {
  if (item.stock === 0) {
    return { variant: 'destructive', text: 'Out of Stock' };
  }
  if (item.stock <= item.lowStockThreshold) {
    return { variant: 'secondary', text: 'Low Stock' };
  }
  return { variant: 'default', text: 'In Stock' };
}

export function InventoryTable({
  initialItems,
  onOpenRequisition,
}: {
  initialItems: InventoryItem[];
  onOpenRequisition: (items: InventoryItem[]) => void;
}) {
  const { toast } = useToast();
  const [items, setItems] = React.useState(initialItems);
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  const handleRequestItem = (item: InventoryItem) => {
    toast({
      title: 'Supply Request Sent',
      description: `A request for ${item.name} has been sent to the family.`,
    });
  };

  const handleRequisition = () => {
    const itemsToRequisition = items.filter(item => selectedItems.has(item.id));
    if (itemsToRequisition.length > 0) {
      onOpenRequisition(itemsToRequisition);
    } else {
      toast({
        title: 'No Items Selected',
        description: 'Please select items to create a requisition.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg">All Supplies</h3>
        <Button onClick={handleRequisition} disabled={selectedItems.size === 0}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Requisition ({selectedItems.size})
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedItems.size > 0 && selectedItems.size === items.length}
                onCheckedChange={handleToggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="text-right w-[150px]">In Stock</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const status = getStockStatus(item);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => handleToggleSelect(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.text}</Badge>
                </TableCell>
                <TableCell className="text-right">{item.stock}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRequestItem(item)}>
                        Request Item
                      </DropdownMenuItem>
                      <DropdownMenuItem>Update Stock</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
