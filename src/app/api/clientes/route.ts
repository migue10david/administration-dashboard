import { prisma } from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'


// GET /api/clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany()
    return NextResponse.json(clientes, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching clientes' }, { status: 500 })
  }
}

// POST /api/clientes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, direccion, telefono, nacionalidad } = body

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        direccion,
        telefono,
        nacionalidad,
      },
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating cliente' }, { status: 500 })
  }
}

// PUT /api/clientes?id=...
export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { nombre, direccion, telefono, nacionalidad } = body

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nombre,
        direccion,
        telefono,
        nacionalidad,
      },
    })

    return NextResponse.json(cliente, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error updating cliente' }, { status: 500 })
  }
}

// DELETE /api/clientes?id=...
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
    }

    await prisma.cliente.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Cliente eliminado correctamente' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting cliente' }, { status: 500 })
  }
}