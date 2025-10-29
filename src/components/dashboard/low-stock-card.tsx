import { Archive, AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { InventoryItem } from '@/lib/types';

export function LowStockCard({ items }: { items: InventoryItem[] }) {
  const lowStockItems = items
    .filter((item) => item.stock <= item.lowStockThreshold)
    .slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>
              {lowStockItems.length} items need attention.
            </CardDescription>
          </div>
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          <ul className="space-y-3">
            {lowStockItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: <span className="text-destructive font-semibold">{item.stock}</span>
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/inventory">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">All inventory levels are sufficient.</p>
        )}
      </CardContent>
    </Card>
  );
}
