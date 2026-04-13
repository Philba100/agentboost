import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  const mdPath = path.join(process.cwd(), 'skills', id, 'SKILL.md');
  try {
    const content = await fs.promises.readFile(mdPath, 'utf8');
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
}
