import { AppHeader } from '@/components/app-header';
import { ShiftManagement } from '@/components/shifts/shift-management';

export default function ShiftsPage() {
  return (
    <>
      <AppHeader title="Gestão de Plantões" />
      <main className="flex-1 flex flex-col bg-background">
        <ShiftManagement />
      </main>
    </>
  );
}
