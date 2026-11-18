import { NextResponse } from 'next/server';
import { requireLevel } from '@/utils/auth-guards';
import { matrimonialService } from '@/modules/matrimonial/matrimonial-service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await requireLevel(2);
  try {
    const tree = await matrimonialService.getFamilyTreeForProfile(params.id);
    // Assume the service returns a plain object with `root` and `verified` flags.
    return NextResponse.json(tree);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}
