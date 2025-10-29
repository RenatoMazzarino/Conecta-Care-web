import Link from 'next/link';
import { BotMessageSquare, PlusCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button asChild variant="default" size="lg" className="justify-start">
          <Link href="/inventory">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Requisition
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="justify-start">
          <Link href="/assistant">
            <BotMessageSquare className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="justify-start">
          <Link href="#">
            <Send className="mr-2 h-4 w-4" />
            Send Update to Family
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
