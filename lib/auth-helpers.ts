import { auth } from '@/auth';
import { ForbiddenError, UnauthorizedError } from './errors';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new UnauthorizedError('You must be logged in');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
  return session;
}

export async function getSession() {
  return await auth();
}

