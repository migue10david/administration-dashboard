// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Transacción para eliminar usuarios
  await prisma.$transaction(async (tx) => {
    await tx.user.deleteMany();
    await tx.account.deleteMany();
    await tx.session.deleteMany();
    await tx.country.deleteMany();
    await tx.state.deleteMany();
    await tx.city.deleteMany();
    await tx.customer.deleteMany();
    await tx.checkTransactionType.deleteMany();
    await tx.checkTransaction.deleteMany();
    await tx.company.deleteMany();
    await tx.wireTransfer.deleteMany();
  });

  // Aquí puedes añadir más transacciones o operaciones
  // Por ejemplo:
  await prisma.$transaction(async (tx) => {
    // Operaciones dentro de la transacción
    const user = await tx.user.create({
      data: {
        name: 'Miguel',
        email: 'miguel@example.com', 
        password: await bcrypt.hash("123456", 10),
        role: 'ADMIN',
      },
    });

    const country =await tx.country.create({
      data: {
        name: 'Mexico',
        code: 'MX',
        createdById: user.id,
      },
    });
  
    const state = await tx.state.create({
      data: {
        name: 'Jalisco',
        code: 'JAL',
        countryId: country.id,
        createdById: user.id,
      },
    });

    const city = await tx.city.create({
      data: {
        name: 'Guadalajara',
        stateId: state.id,
        createdById: user.id,
      },
    });

    await tx.company.createMany({
      data: [
        {
          name: 'Wire',
          description: 'Wire Transfer',
          createdById: user.id,
        },
        {
          name: 'Vigo',
          description: 'Banco Vigo',
          createdById: user.id,
        },
        {
          name: 'Westerunion',
          description: 'Compañia WesterUnion',
          createdById: user.id,
        },
      ],
    });

    await tx.customer.createMany({
      data: [
        {
          code: '8938',
          firstName: 'Antonio',
          middleName: 'Jose',
          lastNameOne: 'Perez',
          lastNameTwo: 'Sanchez',
          address: 'Calle 123',
          apartment: '23',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10300',
          phone: '1001001001',
          dob: new Date('1990-01-01'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'CUSTOMER',
          notes: '',
        },
        {
          code: '8939',
          firstName: 'Juan',
          middleName: 'Carlos',
          lastNameOne: 'Rodriguez',
          lastNameTwo: 'Diaz',
          address: 'Calle 19',
          apartment: '32',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10300',
          phone: '1001001002',
          dob: new Date('1990-01-02'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'CUSTOMER',
          notes: '',
        },
        {
          code: '8940',
          firstName: 'Maria',
          middleName: 'Teresa',
          lastNameOne: 'Gonzalez',
          lastNameTwo: 'Perez',
          address: 'Calle 31',
          apartment: '33',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10400',
          phone: '1001001003',
          dob: new Date('1990-01-03'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'CUSTOMER',
          notes: '',
        },
        {
          code: '8950',
          firstName: 'Javier',
          middleName: '',
          lastNameOne: 'Maroto',
          lastNameTwo: 'Pacheco',
          address: 'Calle 44',
          apartment: '53',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10300',
          phone: '1001001005',
          dob: new Date('1990-01-05'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'RECIPIENT',
          notes: '',
        }

      ],
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