import { AppHeader } from '@/components/app-header';
import { PatientCard } from '@/components/dashboard/patient-card';
import { LowStockCard } from '@/components/dashboard/low-stock-card';
import { QuickActionsCard } from '@/components/dashboard/quick-actions-card';
import { patient, inventory } from '@/lib/data';

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6 bg-background">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PatientCard patient={patient} />
          </div>
          <div className="lg:col-span-1">
            <LowStockCard items={inventory} />
          </div>
          <div className="lg:col-span-1">
            <QuickActionsCard />
          </div>
        </div>
      </main>
    </>
  );
}
