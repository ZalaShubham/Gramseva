import { NextResponse } from 'next/server';
import { requireLevel } from '@/utils/auth-guards';
import { matrimonialService } from '@/modules/matrimonial/matrimonial-service';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await requireLevel(2);
  const { fileName, url, privacy } = await request.json(); // In real app, you'd handle multipart/form-data
  // For stub, we just add the photo info directly.
  const profile = (matrimonialService as any).profiles[params.id];
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const newPhoto = { id: crypto.randomUUID(), url, privacy };
  profile.photos.push(newPhoto);
  return NextResponse.json(newPhoto, { status: 201 });
}
