import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-change-this-before-deployment');
export async function createSession(user: { id: string; role: string }) {
  const token = await new SignJWT({ role: user.role }).setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime('7d').sign(secret);
  (await cookies()).set('flood_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  const token = (await cookies()).get('flood_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    return await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true, role: true } });
  } catch { return null; }
}
export async function requireUser() {
  const user = await getSession();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}
