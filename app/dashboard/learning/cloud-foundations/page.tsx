import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import CloudFoundationsClient from '@/components/learning/CloudFoundationsClient';
import { authOptions } from '@/lib/auth';

export default async function CloudFoundationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <DashboardLayout user={session.user} currentPage="Cloud Foundations" fullWidth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CloudFoundationsClient />
        </div>
      </div>
    </DashboardLayout>
  );
}
