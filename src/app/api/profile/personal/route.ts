import { NextResponse } from 'next/server';
import { requireLevel } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const personalSchema = z.object({
  fullName: z.string().min(2),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['MALE','FEMALE','OTHER']),
  maritalStatus: z.enum(['UNMARRIED','MARRIED','DIVORCED','WIDOWED','SEPARATED']),
});

export async function GET() {
  const user = await requireLevel(1);
  const data = await prisma.personalDetails.findUnique({ where: { userId: user.id } });
  return NextResponse.json(data ?? {});
}

export async function PUT(req: Request) {
  const user = await requireLevel(1);
  const body = await req.json();
  const parsed = personalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const saved = await prisma.personalDetails.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: { ...parsed.data },
  });
  return NextResponse.json(saved);
}
