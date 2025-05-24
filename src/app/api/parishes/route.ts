import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const parishes = await prisma.parish.findMany({
      include: {
        fundraisingGoals: {
          where: {
            isActive: true
          }
        }
      }
    });
    
    return NextResponse.json(parishes);
  } catch (error) {
    console.error('Error fetching parishes:', error);
    return NextResponse.json({ error: 'Failed to fetch parishes' }, { status: 500 });
  }
}
