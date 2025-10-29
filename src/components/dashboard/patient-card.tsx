import Image from 'next/image';
import Link from 'next/link';
import { Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.avatarHint} />
              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold leading-none">{patient.name}</p>
              <p className="text-sm text-muted-foreground">{patient.age} years old</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <h3 className="font-medium text-foreground mb-2">Family Contact</h3>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{patient.familyContact.name}</span>
          </div>
          <div className="flex items-center mt-2">
            <Phone className="mr-2 h-4 w-4" />
            <span>{patient.familyContact.phone}</span>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/assistant">View Full Medical History</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
