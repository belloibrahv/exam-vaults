import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import UsersManagement from './UsersManagement';

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          examAttempts: true,
          userProgress: true,
        },
      },
      examAttempts: {
        take: 1,
        orderBy: { startedAt: 'desc' },
        select: {
          startedAt: true,
        },
      },
    },
  });

  return <UsersManagement users={users} />;
}
