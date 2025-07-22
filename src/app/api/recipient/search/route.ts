// app/api/recipient/search/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { CustomerWhereInput } from '@/app/lib/types/customer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || '';

    const where: CustomerWhereInput = {
      AND: [
        { isActive: true },
        { type: 'RECIPIENT' },
        {
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { lastNameOne: { contains: term, mode: 'insensitive' } },
            { lastNameTwo: { contains: term, mode: 'insensitive' } },
            { code: { contains: term, mode: 'insensitive' } },
          ],
        },
      ],
    };

    const recipients = await prisma.customer.findMany({
      where,
      take: 10, // Limitar resultados
      select: {
        id: true,
        code: true,
        firstName: true,
        lastNameOne: true,
        lastNameTwo: true,
        phone: true,
      },
    });

    return NextResponse.json(recipients);
  } catch (error) {
    console.error('Error buscando beneficiarios:', error);
    return NextResponse.json(
      { error: 'Error buscando beneficiarios' },
      { status: 500 }
    );
  }
}