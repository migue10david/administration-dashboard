// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Transacción para eliminar usuarios
  await prisma.$transaction(async (tx) => {
    await tx.user.deleteMany();
  });

  // Aquí puedes añadir más transacciones o operaciones
  // Por ejemplo:
  await prisma.$transaction(async (tx) => {
    // Operaciones dentro de la transacción
    await tx.user.create({
      data: {
        name: 'Miguel',
        email: 'miguel@example.com', 
        password: '123456',
        role: 'ADMIN',
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });