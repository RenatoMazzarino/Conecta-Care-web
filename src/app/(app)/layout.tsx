import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppSidebar />
      <div className="flex flex-col sm:ml-64">
        {children}
      </div>
    </div>
  );
}
