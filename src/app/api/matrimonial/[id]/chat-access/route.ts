import { NextResponse } from 'next/server';
import { requireLevel } from '@/utils/auth-guards';
import { matrimonialService } from '@/modules/matrimonial/matrimonial-service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // `id` is the *other* profile's id. The current user is derived from session.
  const session = await requireLevel(2);
  const meProfile = Object.values((matrimonialService as any).profiles).find((p:any)=>p.ownerUserId===session.id);
  if (!meProfile) return NextResponse.json({ allowed: false }, { status: 403 });
  const otherProfile = (matrimonialService as any).profiles[params.id];
  if (!otherProfile) return NextResponse.json({ allowed: false }, { status: 404 });

  const hasAccepted = Object.values((matrimonialService as any).interests).some(
    (i:any) =>
      i.status === 'accepted' &&
      ((i.fromProfileId === meProfile.id && i.toProfileId === otherProfile.id) ||
        (i.fromProfileId === otherProfile.id && i.toProfileId === meProfile.id))
  );
  return NextResponse.json({ allowed: hasAccepted });
}
