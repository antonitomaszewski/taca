import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { parishToParafia } from '../../../interfaces/types';

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

    // Convert to legacy format for backward compatibility
    const parafie = parishes.map(parishToParafia);
    
    return NextResponse.json(parafie);
  } catch (error) {
    console.error('Error fetching parishes:', error);
    return NextResponse.json({ error: 'Failed to fetch parishes' }, { status: 500 });
  }
}
