import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';

/**
 * Check if the current user is an admin
 * Throws an error if not authenticated or not an admin
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return session;
}

/**
 * Check if the current user is an admin (returns boolean)
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
}

/**
 * Get admin session or null
 */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }
  
  return session;
}
