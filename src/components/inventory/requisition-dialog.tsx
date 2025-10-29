'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { InventoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2 } from 'lucide-react';

type RequisitionItem = InventoryItem & { quantity: number };

export function RequisitionDialog({
  isOpen,
  onOpenChange,
  items,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: InventoryItem[];
}) {
  const { toast } = useToast();
  const [requisitionItems, setRequisitionItems] = React.useState<RequisitionItem[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setRequisitionItems(items.map(item => ({ ...item, quantity: 1 })));
    }
  }, [isOpen, items]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setRequisitionItems(prevItems => 
      prevItems.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item)
    );
  };
  
  const handleRemoveItem = (itemId: string) => {
    setRequisitionItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleSubmit = () => {
    toast({
      title: 'Requisition Sent',
      description: `${requisitionItems.length} items have been requested from the family.`,
    });
    onOpenChange(false);
  };
  
  const totalItems = requisitionItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Supply Requisition</DialogTitle>
          <DialogDescription>
            Review the items and quantities before sending the request to the family.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[50vh] overflow-y-auto pr-2">
          {requisitionItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
              <div>
                <Label htmlFor={`item-${item.id}`} className="font-medium">{item.name}</Label>
                <p className="text-sm text-muted-foreground">In Stock: {item.stock}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id={`item-${item.id}`}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                  className="w-16 h-8 text-center"
                />
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" placeholder="e.g., Please buy the brand name ointment if possible." />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={requisitionItems.length === 0}>
            Send Request ({totalItems} items)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
