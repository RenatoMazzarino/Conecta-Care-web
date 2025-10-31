import { redirect } from 'next/navigation';

export default function RootPage() {
  // The middleware already handles redirecting unauthenticated users to /login.
  // This page's sole purpose is to redirect authenticated users to the main app dashboard.
  redirect('/dashboard');
}
