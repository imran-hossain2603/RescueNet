import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.').transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Please check your details.' }, { status: 400 });
    }

    const data = parsed.data;
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, role: 'CITIZEN' },
    });

    await createSession(user);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'This email address is already registered. Please sign in instead.' }, { status: 409 });
    }

    console.error('[POST /api/auth/register] Registration failed:', error);
    const message = error instanceof Error && error.name === 'PrismaClientInitializationError'
      ? 'Cannot connect to the database. Check DATABASE_URL in .env and run npm run db:setup.'
      : 'Registration failed because the database is not ready. In the VS Code terminal, run npm run db:setup, then restart the server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
